const hospitalService = require('../services/hospitalService');

// Create a new hospital
exports.createHospital = async (req, res) => {
    try {
        const hospital = await hospitalService.createHospital(req.body);
        res.status(201).json(hospital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalService.getAllHospitals();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a hospital by ID
exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await hospitalService.getHospitalById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a hospital by ID
exports.updateHospital = async (req, res) => {
    try {
        const hospital = await hospitalService.updateHospital(req.params.id, req.body);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a hospital by ID
exports.deleteHospital = async (req, res) => {
    try {
        await hospitalService.deleteHospital(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all unique specialties
exports.getSpecialties = async (req, res) => {
    try {
        const specialties = await hospitalService.getSpecialties();
        res.status(200).json({ specialties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search for hospitals
exports.searchHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalService.searchHospitals(req.query);
        res.status(200).json({ hospitals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find nearby hospitals
exports.findNearbyHospitals = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        const hospitals = await hospitalService.findNearbyHospitals(parseFloat(latitude), parseFloat(longitude), parseInt(radius));
        res.status(200).json({ hospitals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get emergency hospitals
exports.getEmergencyHospitals = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const hospitals = await hospitalService.getEmergencyHospitals(parseFloat(lat), parseFloat(lng));
        res.status(200).json({ hospitals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
