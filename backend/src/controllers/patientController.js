const Patient = require('../models/Patient');
const patientService = require('../services/patientService');

// Create a new patient
exports.createPatient = async (req, res) => {
    try {
        const patientData = req.body;
        const newPatient = await patientService.createPatient(patientData);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await patientService.getAllPatients();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
};

// Get a patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patientId = req.params.id;
        const patient = await patientService.getPatientById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient', error: error.message });
    }
};

// Update a patient
exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const updatedData = req.body;
        const updatedPatient = await patientService.updatePatient(patientId, updatedData);
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const deletedPatient = await patientService.deletePatient(patientId);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
};