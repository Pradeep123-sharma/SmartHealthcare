const Medicine = require('../models/Medicine');

// Search medicines
const searchMedicines = async (req, res) => {
  try {
    const { 
      query, 
      category, 
      prescriptionRequired, 
      page = 1, 
      limit = 20,
      location 
    } = req.query;

    const searchCriteria = {};

    // Text search
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } },
        { manufacturer: { $regex: query, $options: 'i' } },
        { activeIngredients: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      searchCriteria.category = category;
    }

    // Prescription requirement filter
    if (prescriptionRequired !== undefined) {
      searchCriteria.prescriptionRequired = prescriptionRequired === 'true';
    }

    const skip = (page - 1) * limit;

    const medicines = await Medicine.find(searchCriteria)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Medicine.countDocuments(searchCriteria);

    // Filter availability by location if provided
    let medicinesWithAvailability = medicines;
    if (location) {
      medicinesWithAvailability = medicines.map(medicine => {
        const availableNearby = medicine.availability.filter(avail => 
          avail.location.toLowerCase().includes(location.toLowerCase())
        );
        
        return {
          ...medicine.toObject(),
          nearbyAvailability: availableNearby
        };
      });
    }

    res.json({
      message: 'Medicines found',
      medicines: medicinesWithAvailability,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ message: 'Error searching medicines' });
  }
};

// Get medicine details
const getMedicineDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      message: 'Medicine details retrieved',
      medicine
    });

  } catch (error) {
    console.error('Medicine details error:', error);
    res.status(500).json({ message: 'Error fetching medicine details' });
  }
};

// Get medicine alternatives
const getMedicineAlternatives = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Find alternatives based on active ingredients and category
    const alternatives = await Medicine.find({
      _id: { $ne: id },
      $or: [
        { genericName: medicine.genericName },
        { activeIngredients: { $in: medicine.activeIngredients } },
        { 
          category: medicine.category,
          activeIngredients: { $elemMatch: { $in: medicine.activeIngredients } }
        }
      ]
    }).limit(10);

    res.json({
      message: 'Medicine alternatives found',
      originalMedicine: {
        id: medicine._id,
        name: medicine.name,
        genericName: medicine.genericName
      },
      alternatives: alternatives.map(alt => ({
        id: alt._id,
        name: alt.name,
        genericName: alt.genericName,
        manufacturer: alt.manufacturer,
        dosageForms: alt.dosageForms,
        prescriptionRequired: alt.prescriptionRequired,
        ratings: alt.ratings
      }))
    });

  } catch (error) {
    console.error('Medicine alternatives error:', error);
    res.status(500).json({ message: 'Error finding medicine alternatives' });
  }
};

// Get medicine categories
const getCategories = async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    
    res.json({
      message: 'Medicine categories retrieved',
      categories: categories.sort()
    });

  } catch (error) {
    console.error('Medicine categories error:', error);
    res.status(500).json({ message: 'Error fetching medicine categories' });
  }
};

// Check drug interactions
const checkInteractions = async (req, res) => {
  try {
    const { medicineIds } = req.body;

    if (!medicineIds || !Array.isArray(medicineIds) || medicineIds.length < 2) {
      return res.status(400).json({ 
        message: 'At least 2 medicine IDs are required to check interactions' 
      });
    }

    const medicines = await Medicine.find({ 
      _id: { $in: medicineIds } 
    }).select('name genericName interactions activeIngredients');

    if (medicines.length !== medicineIds.length) {
      return res.status(400).json({ message: 'Some medicines not found' });
    }

    // Check for interactions
    const interactions = [];
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const med1 = medicines[i];
        const med2 = medicines[j];

        // Check if med1 lists med2 in interactions
        const hasInteraction = med1.interactions.some(interaction => 
          interaction.toLowerCase().includes(med2.name.toLowerCase()) ||
          interaction.toLowerCase().includes(med2.genericName.toLowerCase())
        ) || med2.interactions.some(interaction => 
          interaction.toLowerCase().includes(med1.name.toLowerCase()) ||
          interaction.toLowerCase().includes(med1.genericName.toLowerCase())
        );

        if (hasInteraction) {
          interactions.push({
            medicine1: { id: med1._id, name: med1.name },
            medicine2: { id: med2._id, name: med2.name },
            severity: 'moderate', // This would be determined by a medical database
            description: 'Potential interaction detected. Consult healthcare provider.'
          });
        }
      }
    }

    res.json({
      message: 'Drug interaction check completed',
      medicines: medicines.map(med => ({
        id: med._id,
        name: med.name,
        genericName: med.genericName
      })),
      interactions,
      hasInteractions: interactions.length > 0,
      recommendation: interactions.length > 0 ? 
        'Potential interactions found. Please consult your healthcare provider.' :
        'No known interactions found, but always consult your healthcare provider.'
    });

  } catch (error) {
    console.error('Drug interaction check error:', error);
    res.status(500).json({ message: 'Error checking drug interactions' });
  }
};

module.exports = {
  searchMedicines,
  getMedicineDetails,
  getMedicineAlternatives,
  getCategories,
  checkInteractions
};