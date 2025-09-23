const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middlewares/authMiddleware');

// Route to get all doctors
router.get('/', authenticate, doctorController.getAllDoctors);

// Route to get a doctor by ID
router.get('/:id', authenticate, doctorController.getDoctorById);

// Route to add a new doctor
router.post('/', authenticate, doctorController.addDoctor);

// Route to update a doctor's information
router.put('/:id', authenticate, doctorController.updateDoctor);

// Route to delete a doctor
router.delete('/:id', authenticate, doctorController.deleteDoctor);

module.exports = router;