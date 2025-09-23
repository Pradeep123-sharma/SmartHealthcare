const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path based on your User model location

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is defined in your .env file
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authenticate;