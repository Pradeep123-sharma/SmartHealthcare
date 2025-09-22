const express = require('express');
const { 
  findNearbyHospitals, 
  getHospitalDetails, 
  searchHospitals, 
  getSpecialties, 
  getEmergencyHospitals 
} = require('../controllers/hospitalController');

const router = express.Router();

// @route   GET /api/hospitals/nearby
// @desc    Find nearby hospitals
// @access  Public
router.get('/nearby', findNearbyHospitals);

// @route   GET /api/hospitals/search
// @desc    Search hospitals
// @access  Public
router.get('/search', searchHospitals);

// @route   GET /api/hospitals/emergency
// @desc    Get emergency hospitals
// @access  Public
router.get('/emergency', getEmergencyHospitals);

// @route   GET /api/hospitals/specialties
// @desc    Get hospital specialties
// @access  Public
router.get('/specialties', getSpecialties);

// @route   GET /api/hospitals/:id
// @desc    Get hospital details
// @access  Public
router.get('/:id', getHospitalDetails);

module.exports = router;