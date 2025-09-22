const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getDashboard, getHealthSummary, updateHealthInfo } = require('../controllers/patientController');

const router = express.Router();

// @route   GET /api/patients/dashboard
// @desc    Get patient dashboard data
// @access  Private (Patient)
router.get('/dashboard', auth, authorize('patient'), getDashboard);

// @route   GET /api/patients/health-summary
// @desc    Get patient health summary
// @access  Private (Patient)
router.get('/health-summary', auth, authorize('patient'), getHealthSummary);

// @route   PUT /api/patients/health-info
// @desc    Update patient health information
// @access  Private (Patient)
router.put('/health-info', auth, authorize('patient'), updateHealthInfo);

module.exports = router;