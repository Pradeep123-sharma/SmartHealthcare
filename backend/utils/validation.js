const Joi = require('joi');

// User registration validation schemas
const registerPatientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, uppercase letter, number, and special character'
    }),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[+]?[1-9][\d]{9,14}$/).required(),
  preferredLanguage: Joi.string().valid('en', 'hi').default('en'),
  // Patient specific fields
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  address: Joi.object({
    street: Joi.string().trim().max(200),
    city: Joi.string().trim().max(100),
    state: Joi.string().trim().max(100),
    pincode: Joi.string().pattern(/^[0-9]{6}$/),
    country: Joi.string().default('India')
  }).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().trim().max(100),
    phone: Joi.string().pattern(/^[+]?[1-9][\d]{9,14}$/),
    relation: Joi.string().trim().max(50)
  }).optional()
});

const registerDoctorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[+]?[1-9][\d]{9,14}$/).required(),
  preferredLanguage: Joi.string().valid('en', 'hi').default('en'),
  // Doctor specific fields
  licenseNumber: Joi.string().trim().required(),
  specialization: Joi.string().trim().required(),
  experience: Joi.number().min(0).max(60).required(),
  consultationFee: Joi.number().min(0).required(),
  qualification: Joi.array().items(Joi.object({
    degree: Joi.string().trim().required(),
    institution: Joi.string().trim().required(),
    year: Joi.number().min(1950).max(new Date().getFullYear()).required()
  })).optional(),
  hospital: Joi.object({
    name: Joi.string().trim(),
    address: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim()
  }).optional(),
  languages: Joi.array().items(Joi.string().valid('en', 'hi')).default(['en'])
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Profile update schemas
const updateUserProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  phone: Joi.string().pattern(/^[+]?[1-9][\d]{9,14}$/),
  preferredLanguage: Joi.string().valid('en', 'hi'),
  profilePicture: Joi.string().uri(),
  address: Joi.object({
    street: Joi.string().trim().max(200),
    city: Joi.string().trim().max(100),
    state: Joi.string().trim().max(100),
    pincode: Joi.string().pattern(/^[0-9]{6}$/),
    country: Joi.string().default('India')
  }),
  emergencyContact: Joi.object({
    name: Joi.string().trim().max(100),
    phone: Joi.string().pattern(/^[+]?[1-9][\d]{9,14}$/),
    relation: Joi.string().trim().max(50)
  })
});

const updatePatientProfileSchema = Joi.object({
  dateOfBirth: Joi.date().max('now'),
  gender: Joi.string().valid('male', 'female', 'other'),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  height: Joi.object({
    value: Joi.number().min(50).max(300),
    unit: Joi.string().valid('cm', 'ft').default('cm')
  }),
  weight: Joi.object({
    value: Joi.number().min(10).max(500),
    unit: Joi.string().valid('kg', 'lb').default('kg')
  }),
  allergies: Joi.array().items(Joi.string().trim()),
  chronicConditions: Joi.array().items(Joi.string().trim()),
  insuranceInfo: Joi.object({
    provider: Joi.string().trim(),
    policyNumber: Joi.string().trim(),
    validUntil: Joi.date().min('now')
  })
});

module.exports = {
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
  updateUserProfileSchema,
  updatePatientProfileSchema
};