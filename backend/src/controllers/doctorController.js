const doctorService = require('../services/doctorService');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

// Get a doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
};

// Add a new doctor
exports.addDoctor = async (req, res) => {
    try {
        const savedDoctor = await doctorService.createDoctor(req.body);
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: 'Error adding doctor', error: error.message });
    }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(400).json({ message: 'Error updating doctor', error: error.message });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await doctorService.deleteDoctor(req.params.id);
        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
};

// Get doctor dashboard data
exports.getDoctorDashboard = async (req, res) => {
    try {
        const dashboardData = await doctorService.getDoctorDashboard(req.user.id);
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor dashboard', error: error.message });
    }
};