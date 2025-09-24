const express = require('express');
const hospitalController = require('../controllers/hospitalController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Search and filter
router.get('/search', hospitalController.searchHospitals);
router.get('/specialties', hospitalController.getSpecialties);
router.get('/nearby', hospitalController.findNearbyHospitals);
router.get('/emergency', hospitalController.getEmergencyHospitals);

// CRUD operations
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.post('/', authenticate, hospitalController.createHospital);
router.put('/:id', authenticate, hospitalController.updateHospital);
router.delete('/:id', authenticate, hospitalController.deleteHospital);

module.exports = router;
