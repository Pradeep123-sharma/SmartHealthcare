const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty'),
];

const validateHealthRecord = [
    body('patientId')
        .isString()
        .withMessage('Patient ID must be a string')
        .notEmpty()
        .withMessage('Patient ID cannot be empty'),
    body('doctorId')
        .isString()
        .withMessage('Doctor ID must be a string')
        .notEmpty()
        .withMessage('Doctor ID cannot be empty'),
    body('record')
        .isObject()
        .withMessage('Record must be an object')
        .notEmpty()
        .withMessage('Record cannot be empty'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateHealthRecord,
    validate,
};