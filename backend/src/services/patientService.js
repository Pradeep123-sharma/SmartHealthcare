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

// New function to get patient dashboard data
const getPatientDashboard = async (patientId) => {
    // This is placeholder logic. Replace with actual database queries.
    // For now, it returns mock data to satisfy the API call.
    return {
        healthSummary: {
            status: 'Normal',
        },
        upcomingAppointments: [
            { id: 1, doctor: 'Dr. Smith', date: '9/27/2025' },
            { id: 2, doctor: 'Dr. Jones', date: '10/1/2025' },
        ],
        healthRecords: {
            count: 8,
            documents: ['doc1.pdf', 'doc2.pdf'],
        },
        bmi: {
            value: 24.5,
            status: 'Normal',
        },
        bloodGroup: {
            type: 'O+',
        },
        healthReminders: [
            { id: 1, reminder: 'Upcoming appointment with Dr. Smith', date: '9/27/2025' },
            { id: 2, reminder: 'Time for your vitamin D supplement' },
        ],
    };
};

// New function to get patient health summary
const getHealthSummary = async (patientId) => {
    // This is placeholder logic. Replace with actual database queries.
    return {
        status: 'Normal',
        lastUpdated: new Date(),
    };
};
module.exports = {
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    getAllPatients,
    getPatientDashboard,
    getHealthSummary,
};