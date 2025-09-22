const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  triggerSOS, 
  getEmergencyStatus, 
  getEmergencyHistory, 
  updateEmergencyStatus 
} = require('../controllers/emergencyController');

const router = express.Router();

// @route   POST /api/emergency/sos
// @desc    Trigger emergency SOS
// @access  Private
router.post('/sos', auth, triggerSOS);

// @route   GET /api/emergency/:emergencyId
// @desc    Get emergency status
// @access  Private
router.get('/:emergencyId', auth, getEmergencyStatus);

// @route   GET /api/emergency/history
// @desc    Get emergency history
// @access  Private
router.get('/history', auth, getEmergencyHistory);

// @route   PUT /api/emergency/:emergencyId/status
// @desc    Update emergency status
// @access  Private
router.put('/:emergencyId/status', auth, updateEmergencyStatus);

module.exports = router;