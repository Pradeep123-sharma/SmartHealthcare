const Hospital = require('../models/Hospital');

// Find nearby hospitals
const findNearbyHospitals = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      radius = 10, // Default 10km radius
      specialty,
      type,
      emergencyServices,
      page = 1,
      limit = 20
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInKm = parseFloat(radius);

    // MongoDB geospatial query
    const query = {
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      }
    };

    // Add filters
    if (specialty) {
      query.specialties = { $in: [new RegExp(specialty, 'i')] };
    }

    if (type) {
      query.type = type;
    }

    if (emergencyServices === 'true') {
      query['emergencyServices.ambulance'] = true;
    }

    const skip = (page - 1) * limit;

    const hospitals = await Hospital.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Calculate distance for each hospital
    const hospitalsWithDistance = hospitals.map(hospital => {
      const hospitalLat = hospital.address.coordinates?.latitude;
      const hospitalLng = hospital.address.coordinates?.longitude;
      
      let distance = null;
      if (hospitalLat && hospitalLng) {
        distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);
      }

      return {
        ...hospital.toObject(),
        distance: distance ? `${distance.toFixed(1)} km` : 'Distance unavailable'
      };
    });

    const total = await Hospital.countDocuments(query);

    res.json({
      message: 'Nearby hospitals found',
      hospitals: hospitalsWithDistance,
      searchLocation: { latitude: lat, longitude: lng },
      radius: `${radiusInKm} km`,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Nearby hospitals error:', error);
    res.status(500).json({ message: 'Error finding nearby hospitals' });
  }
};

// Get hospital details
const getHospitalDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      message: 'Hospital details retrieved',
      hospital
    });

  } catch (error) {
    console.error('Hospital details error:', error);
    res.status(500).json({ message: 'Error fetching hospital details' });
  }
};

// Search hospitals by name or location
const searchHospitals = async (req, res) => {
  try {
    const { 
      query,
      city,
      state,
      specialty,
      type,
      page = 1,
      limit = 20
    } = req.query;

    const searchCriteria = {};

    // Text search
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } },
        { 'address.state': { $regex: query, $options: 'i' } },
        { specialties: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Location filters
    if (city) {
      searchCriteria['address.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      searchCriteria['address.state'] = { $regex: state, $options: 'i' };
    }

    // Specialty filter
    if (specialty) {
      searchCriteria.specialties = { $in: [new RegExp(specialty, 'i')] };
    }

    // Type filter
    if (type) {
      searchCriteria.type = type;
    }

    const skip = (page - 1) * limit;

    const hospitals = await Hospital.find(searchCriteria)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hospital.countDocuments(searchCriteria);

    res.json({
      message: 'Hospitals found',
      hospitals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Hospital search error:', error);
    res.status(500).json({ message: 'Error searching hospitals' });
  }
};

// Get hospital specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Hospital.distinct('specialties');
    
    res.json({
      message: 'Hospital specialties retrieved',
      specialties: specialties.sort()
    });

  } catch (error) {
    console.error('Hospital specialties error:', error);
    res.status(500).json({ message: 'Error fetching hospital specialties' });
  }
};

// Get emergency hospitals
const getEmergencyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, radius = 25 } = req.query;

    const query = {
      'emergencyServices.ambulance': true,
      'operatingHours.emergency24x7': true
    };

    // Add location filter if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInKm = parseFloat(radius);

      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInKm * 1000
        }
      };
    }

    const emergencyHospitals = await Hospital.find(query)
      .select('name contact address emergencyServices bedCapacity currentStatus')
      .limit(20);

    // Add distance calculation if coordinates provided
    let hospitalsWithDistance = emergencyHospitals;
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      hospitalsWithDistance = emergencyHospitals.map(hospital => {
        const hospitalLat = hospital.address.coordinates?.latitude;
        const hospitalLng = hospital.address.coordinates?.longitude;
        
        let distance = null;
        if (hospitalLat && hospitalLng) {
          distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);
        }

        return {
          ...hospital.toObject(),
          distance: distance ? `${distance.toFixed(1)} km` : 'Distance unavailable'
        };
      });
    }

    res.json({
      message: 'Emergency hospitals found',
      hospitals: hospitalsWithDistance,
      searchRadius: latitude && longitude ? `${radius} km` : 'All available'
    });

  } catch (error) {
    console.error('Emergency hospitals error:', error);
    res.status(500).json({ message: 'Error finding emergency hospitals' });
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  findNearbyHospitals,
  getHospitalDetails,
  searchHospitals,
  getSpecialties,
  getEmergencyHospitals
};