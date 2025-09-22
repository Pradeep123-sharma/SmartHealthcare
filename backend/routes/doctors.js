const express = require('express');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/doctors/dashboard
// @desc    Get doctor dashboard data
// @access  Private (Doctor)
router.get('/dashboard', auth, authorize('doctor'), async (req, res) => {
  try {
    // Implementation will be added
    res.json({ message: 'Doctor dashboard endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;