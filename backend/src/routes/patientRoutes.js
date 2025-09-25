const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middlewares/authMiddleware');

// === NEW ROUTES ADDED TO FIX THE ERROR ===

// Route to get patient dashboard data
router.get('/dashboard', authenticate, patientController.getPatientDashboard);

// Route to get patient health summary
router.get('/health-summary', authenticate, patientController.getHealthSummary);

// === EXISTING CRUD ROUTES ===

// Route to get all patients
router.get('/', authenticate, patientController.getAllPatients);

// Route to get a patient by ID (Must come AFTER the static routes like /dashboard)
router.get('/:id', authenticate, patientController.getPatientById);

// Route to create a new patient
router.post('/', authenticate, patientController.createPatient);

// Route to update a patient by ID
router.put('/:id', authenticate, patientController.updatePatient);

// Route to delete a patient by ID
router.delete('/:id', authenticate, patientController.deletePatient);

module.exports = router;