const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegistration, validateLogin, validate } = require('../utils/validators');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Registration route
router.post('/register', validateRegistration, validate, register);

// Login route
router.post('/login', validateLogin, validate, login);

// Protected route example
router.get('/profile', authenticate, (req, res) => {
    res.status(200).json({ message: 'User profile data' });
});

module.exports = router;