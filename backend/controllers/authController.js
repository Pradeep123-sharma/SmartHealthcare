const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/generateToken');
const { registerPatientSchema, registerDoctorSchema, loginSchema, updateUserProfileSchema, updatePatientProfileSchema } = require('../utils/validation');

// Register user
const register = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Only allow patient and doctor registration
    if (!role || !['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Only patient and doctor registration allowed.' 
      });
    }

    // Validate input based on role
    const schema = role === 'patient' ? registerPatientSchema : registerDoctorSchema;
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { email, password, firstName, lastName, phone, preferredLanguage, address, emergencyContact } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or phone number' 
      });
    }

    // Create user with only allowed fields
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      preferredLanguage: preferredLanguage || 'en',
      address,
      emergencyContact
    });

    await user.save();

    // Create role-specific profile with validated data
    if (role === 'patient') {
      const { dateOfBirth, gender, bloodGroup } = value;
      const patient = new Patient({
        user: user._id,
        dateOfBirth,
        gender,
        bloodGroup
      });
      await patient.save();
    } else if (role === 'doctor') {
      const { licenseNumber, specialization, experience, consultationFee, qualification, hospital, languages } = value;
      const doctor = new Doctor({
        user: user._id,
        licenseNumber,
        specialization,
        experience,
        consultationFee,
        qualification,
        hospital,
        languages
      });
      await doctor.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email or phone number already exists' 
      });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = value;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get role-specific data with field filtering
    let profileData = null;
    if (user.role === 'patient') {
      profileData = await Patient.findOne({ user: user._id }).select('-__v');
    } else if (user.role === 'doctor') {
      profileData = await Doctor.findOne({ user: user._id }).select('-__v');
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        profileData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = req.user;
    
    // Get role-specific data
    let profileData = null;
    if (user.role === 'patient') {
      profileData = await Patient.findOne({ user: user._id });
    } else if (user.role === 'doctor') {
      profileData = await Doctor.findOne({ user: user._id });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        preferredLanguage: user.preferredLanguage,
        profileData
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate user profile data
    const { error: userError, value: userValue } = updateUserProfileSchema.validate(req.body);
    if (userError) {
      return res.status(400).json({ 
        message: 'Validation error',
        details: userError.details.map(detail => detail.message)
      });
    }

    // Update user data with only allowed fields
    const allowedUserFields = {
      firstName: userValue.firstName,
      lastName: userValue.lastName,
      phone: userValue.phone,
      preferredLanguage: userValue.preferredLanguage,
      profilePicture: userValue.profilePicture,
      address: userValue.address,
      emergencyContact: userValue.emergencyContact
    };

    // Remove undefined fields
    Object.keys(allowedUserFields).forEach(key => {
      if (allowedUserFields[key] === undefined) {
        delete allowedUserFields[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: allowedUserFields },
      { new: true, runValidators: true }
    ).select('-password');

    // Update role-specific profile if patient
    if (userRole === 'patient' && req.body.patientData) {
      const { error: patientError, value: patientValue } = updatePatientProfileSchema.validate(req.body.patientData);
      if (patientError) {
        return res.status(400).json({ 
          message: 'Patient data validation error',
          details: patientError.details.map(detail => detail.message)
        });
      }

      // Remove undefined fields
      const allowedPatientFields = {};
      Object.keys(patientValue).forEach(key => {
        if (patientValue[key] !== undefined) {
          allowedPatientFields[key] = patientValue[key];
        }
      });

      if (Object.keys(allowedPatientFields).length > 0) {
        await Patient.findOneAndUpdate(
          { user: userId },
          { $set: allowedPatientFields },
          { new: true, runValidators: true }
        );
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Phone number already exists' 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};