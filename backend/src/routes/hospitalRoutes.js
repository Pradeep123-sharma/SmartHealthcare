const express = require('express');
const hospitalController = require('../controllers/hospitalController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Route to get a single hospital by ID
router.get('/:id', hospitalController.getHospitalById);

// Route to create a new hospital
router.post('/', authenticate, hospitalController.createHospital);

// Route to update a hospital by ID
router.put('/:id', authenticate, hospitalController.updateHospital);

// Route to delete a hospital by ID
router.delete('/:id', authenticate, hospitalController.deleteHospital);

module.exports = router;