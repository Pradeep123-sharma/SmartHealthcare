const Patient = require('../models/Patient');

const createPatient = async (patientData) => {
    const patient = new Patient(patientData);
    return await patient.save();
};

const getPatientById = async (patientId) => {
    return await Patient.findById(patientId);
};

const updatePatient = async (patientId, updateData) => {
    return await Patient.findByIdAndUpdate(patientId, updateData, { new: true });
};

const deletePatient = async (patientId) => {
    return await Patient.findByIdAndDelete(patientId);
};

const getAllPatients = async () => {
    return await Patient.find();
};

module.exports = {
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    getAllPatients,
};