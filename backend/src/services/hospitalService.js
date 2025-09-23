const Hospital = require('../models/Hospital');

// Create a new hospital
const createHospital = async (hospitalData) => {
    try {
        const hospital = new Hospital(hospitalData);
        await hospital.save();
        return hospital;
    } catch (error) {
        throw new Error('Error creating hospital: ' + error.message);
    }
};

// Get all hospitals
const getAllHospitals = async () => {
    try {
        const hospitals = await Hospital.find();
        return hospitals;
    } catch (error) {
        throw new Error('Error fetching hospitals: ' + error.message);
    }
};

// Get a hospital by ID
const getHospitalById = async (hospitalId) => {
    try {
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        throw new Error('Error fetching hospital: ' + error.message);
    }
};

// Update a hospital by ID
const updateHospital = async (hospitalId, updateData) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(hospitalId, updateData, { new: true });
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        throw new Error('Error updating hospital: ' + error.message);
    }
};

// Delete a hospital by ID
const deleteHospital = async (hospitalId) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(hospitalId);
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        throw new Error('Error deleting hospital: ' + error.message);
    }
};

module.exports = {
    createHospital,
    getAllHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital,
};