const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Access denied' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
      }

      // For doctor role, check if doctor is verified
      if (req.user.role === 'doctor' && roles.includes('doctor')) {
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: req.user._id });
        
        if (!doctor || !doctor.isVerified) {
          return res.status(403).json({ 
            message: 'Doctor account not verified. Please contact administrator.' 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Authorization check failed' });
    }
  };
};

module.exports = { auth, authorize };