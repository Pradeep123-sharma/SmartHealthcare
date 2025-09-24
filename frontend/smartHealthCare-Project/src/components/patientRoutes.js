const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middlewares/authMiddleware');

// Middleware to protect all patient routes
router.use(authenticate);

// Patient Dashboard
router.get('/dashboard', patientController.getPatientDashboard);

// Patient Health Summary
router.get('/health-summary', patientController.getHealthSummary);

// Get all patients (example of another protected route)
router.get('/', patientController.getAllPatients);

// Get a patient by ID
router.get('/:id', patientController.getPatientById);

// Update a patient
router.put('/:id', patientController.updatePatient);


module.exports = router;