const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const authenticate = require('../middlewares/authMiddleware');

// Route to create a new health record
router.post('/', authenticate, healthRecordController.createHealthRecord);

// Route to get all health records
router.get('/', authenticate, healthRecordController.getAllHealthRecords);

// Route to get a specific health record by ID
router.get('/:id', authenticate, healthRecordController.getHealthRecordById);

// Route to update a health record by ID
router.put('/:id', authenticate, healthRecordController.updateHealthRecord);

// Route to delete a health record by ID
router.delete('/:id', authenticate, healthRecordController.deleteHealthRecord);

module.exports = router;