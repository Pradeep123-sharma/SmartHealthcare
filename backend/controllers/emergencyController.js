const Emergency = require('../models/Emergency');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const { sendEmergencySMS } = require('../utils/sendSMS');

// Trigger emergency SOS
const triggerSOS = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      emergencyType,
      severity,
      description,
      location,
      vitals
    } = req.body;

    // Validation
    if (!emergencyType || !severity || !description || !location) {
      return res.status(400).json({
        message: 'Emergency type, severity, description, and location are required'
      });
    }

    if (!location.coordinates || !location.coordinates.latitude || !location.coordinates.longitude) {
      return res.status(400).json({
        message: 'Location coordinates (latitude and longitude) are required'
      });
    }

    // Get patient information
    const patient = await Patient.findOne({ user: userId }).populate('user');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Create emergency record
    const emergency = new Emergency({
      patient: patient._id,
      emergencyType,
      severity,
      description,
      location,
      vitals: vitals || {},
      status: 'active'
    });

    // Add emergency contacts from patient profile
    if (patient.user.emergencyContact) {
      emergency.contacts.push({
        name: patient.user.emergencyContact.name,
        phone: patient.user.emergencyContact.phone,
        relation: patient.user.emergencyContact.relation || 'Emergency Contact'
      });
    }

    await emergency.save();

    // Find nearby emergency hospitals
    const lat = location.coordinates.latitude;
    const lng = location.coordinates.longitude;

    const nearbyHospitals = await Hospital.find({
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 25000 // 25km radius
        }
      },
      'emergencyServices.ambulance': true,
      'operatingHours.emergency24x7': true
    }).limit(5);

    // Send SMS notifications
    const notifications = [];
    
    // Notify emergency contacts
    if (emergency.contacts.length > 0) {
      for (const contact of emergency.contacts) {
        try {
          const smsResult = await sendEmergencySMS(
            contact.phone,
            patient,
            location
          );
          
          if (smsResult.success) {
            contact.notified = true;
            contact.notifiedAt = new Date();
            notifications.push({
              type: 'emergency_contact',
              recipient: contact.name,
              status: 'sent'
            });
          } else {
            notifications.push({
              type: 'emergency_contact',
              recipient: contact.name,
              status: 'failed',
              error: smsResult.error
            });
          }
        } catch (error) {
          console.error('SMS notification error:', error);
          notifications.push({
            type: 'emergency_contact',
            recipient: contact.name,
            status: 'failed',
            error: error.message
          });
        }
      }
    }

    // Update emergency with responders (hospitals)
    nearbyHospitals.forEach(hospital => {
      emergency.responders.push({
        type: 'hospital',
        name: hospital.name,
        phone: hospital.contact.emergencyNumber || hospital.contact.phone,
        status: 'notified'
      });
    });

    await emergency.save();

    res.status(201).json({
      message: 'Emergency SOS triggered successfully',
      emergency: {
        id: emergency._id,
        status: emergency.status,
        emergencyType: emergency.emergencyType,
        severity: emergency.severity,
        location: emergency.location,
        createdAt: emergency.createdAt
      },
      nearbyHospitals: nearbyHospitals.map(hospital => ({
        id: hospital._id,
        name: hospital.name,
        contact: hospital.contact,
        address: hospital.address,
        distance: calculateDistance(lat, lng, 
          hospital.address.coordinates?.latitude, 
          hospital.address.coordinates?.longitude
        )
      })),
      notifications,
      instructions: [
        'Emergency services have been notified',
        'Your emergency contacts have been alerted',
        'Stay calm and follow medical guidance',
        'If possible, stay in a safe location',
        'Emergency responders are being dispatched'
      ]
    });

  } catch (error) {
    console.error('Emergency SOS error:', error);
    res.status(500).json({ message: 'Error triggering emergency SOS' });
  }
};

// Get emergency status
const getEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId } = req.params;
    const userId = req.user._id;

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const emergency = await Emergency.findOne({
      _id: emergencyId,
      patient: patient._id
    }).populate('patient');

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency record not found' });
    }

    res.json({
      message: 'Emergency status retrieved',
      emergency: {
        id: emergency._id,
        emergencyType: emergency.emergencyType,
        severity: emergency.severity,
        status: emergency.status,
        description: emergency.description,
        location: emergency.location,
        vitals: emergency.vitals,
        contacts: emergency.contacts,
        responders: emergency.responders,
        createdAt: emergency.createdAt,
        resolvedAt: emergency.resolvedAt
      }
    });

  } catch (error) {
    console.error('Emergency status error:', error);
    res.status(500).json({ message: 'Error fetching emergency status' });
  }
};

// Get patient's emergency history
const getEmergencyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const skip = (page - 1) * limit;

    const emergencies = await Emergency.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-notes'); // Exclude internal notes

    const total = await Emergency.countDocuments({ patient: patient._id });

    res.json({
      message: 'Emergency history retrieved',
      emergencies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Emergency history error:', error);
    res.status(500).json({ message: 'Error fetching emergency history' });
  }
};

// Update emergency status (for responders)
const updateEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId } = req.params;
    const { status, responderUpdate, notes } = req.body;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency record not found' });
    }

    // Update emergency status
    if (status && ['active', 'responded', 'resolved', 'cancelled'].includes(status)) {
      emergency.status = status;
      
      if (status === 'resolved') {
        emergency.resolvedAt = new Date();
      }
    }

    // Update responder status
    if (responderUpdate && responderUpdate.responderId) {
      const responder = emergency.responders.find(r => 
        r._id.toString() === responderUpdate.responderId
      );
      
      if (responder) {
        responder.status = responderUpdate.status;
        if (responderUpdate.estimatedArrival) {
          responder.estimatedArrival = new Date(responderUpdate.estimatedArrival);
        }
      }
    }

    // Add notes if provided
    if (notes) {
      emergency.notes = (emergency.notes || '') + `\n${new Date().toISOString()}: ${notes}`;
    }

    await emergency.save();

    res.json({
      message: 'Emergency status updated',
      emergency: {
        id: emergency._id,
        status: emergency.status,
        responders: emergency.responders,
        updatedAt: emergency.updatedAt
      }
    });

  } catch (error) {
    console.error('Emergency update error:', error);
    res.status(500).json({ message: 'Error updating emergency status' });
  }
};

// Helper function to calculate distance
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat2 || !lng2) return null;
  
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
  triggerSOS,
  getEmergencyStatus,
  getEmergencyHistory,
  updateEmergencyStatus
};