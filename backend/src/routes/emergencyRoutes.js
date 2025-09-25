const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/sos', authMiddleware, emergencyController.triggerSOS);

module.exports = router;