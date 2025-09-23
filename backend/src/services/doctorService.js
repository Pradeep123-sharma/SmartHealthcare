const Doctor = require('../models/Doctor');

const getAllDoctors = async () => {
    try {
        const doctors = await Doctor.find();
        return doctors;
    } catch (error) {
        throw new Error('Error fetching doctors: ' + error.message);
    }
};

const getDoctorById = async (id) => {
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    } catch (error) {
        throw new Error('Error fetching doctor: ' + error.message);
    }
};

const createDoctor = async (doctorData) => {
    try {
        const newDoctor = new Doctor(doctorData);
        await newDoctor.save();
        return newDoctor;
    } catch (error) {
        throw new Error('Error creating doctor: ' + error.message);
    }
};

const updateDoctor = async (id, doctorData) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorData, { new: true });
        if (!updatedDoctor) {
            throw new Error('Doctor not found');
        }
        return updatedDoctor;
    } catch (error) {
        throw new Error('Error updating doctor: ' + error.message);
    }
};

const deleteDoctor = async (id) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) {
            throw new Error('Doctor not found');
        }
        return deletedDoctor;
    } catch (error) {
        throw new Error('Error deleting doctor: ' + error.message);
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};