const express = require('express');
const { 
  searchMedicines, 
  getMedicineDetails, 
  getMedicineAlternatives, 
  getCategories, 
  checkInteractions 
} = require('../controllers/medicineController');

const router = express.Router();

// @route   GET /api/medicines/search
// @desc    Search medicines
// @access  Public
router.get('/search', searchMedicines);

// @route   GET /api/medicines/categories
// @desc    Get medicine categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/medicines/:id
// @desc    Get medicine details
// @access  Public
router.get('/:id', getMedicineDetails);

// @route   GET /api/medicines/:id/alternatives
// @desc    Get medicine alternatives
// @access  Public
router.get('/:id/alternatives', getMedicineAlternatives);

// @route   POST /api/medicines/check-interactions
// @desc    Check drug interactions
// @access  Public
router.post('/check-interactions', checkInteractions);

module.exports = router;