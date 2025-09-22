const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const Doctor = require('../models/Doctor');

// Get patient dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get patient profile
    const patient = await Patient.findOne({ user: userId }).populate('user');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Get recent appointments
    const recentAppointments = await Appointment.find({ patient: patient._id })
      .populate('doctor')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ appointmentDate: -1 })
      .limit(5);

    // Get recent health records
    const recentHealthRecords = await HealthRecord.find({ patient: patient._id })
      .sort({ date: -1 })
      .limit(5);

    // Calculate health metrics
    const healthMetrics = {
      totalAppointments: await Appointment.countDocuments({ patient: patient._id }),
      upcomingAppointments: await Appointment.countDocuments({ 
        patient: patient._id, 
        appointmentDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
      }),
      totalHealthRecords: await HealthRecord.countDocuments({ patient: patient._id }),
      lastCheckup: await Appointment.findOne({ 
        patient: patient._id, 
        status: 'completed' 
      }).sort({ appointmentDate: -1 })
    };

    // Health reminders
    const reminders = [];
    
    // Check for upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patient: patient._id,
      appointmentDate: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      },
      status: { $in: ['scheduled', 'confirmed'] }
    }).populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });

    upcomingAppointments.forEach(appointment => {
      reminders.push({
        type: 'appointment',
        message: `Upcoming appointment with Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
        date: appointment.appointmentDate,
        priority: 'high'
      });
    });

    // Check for medication reminders (if any current medications)
    if (patient.currentMedications && patient.currentMedications.length > 0) {
      patient.currentMedications.forEach(medication => {
        if (medication.endDate && new Date(medication.endDate) <= new Date()) {
          reminders.push({
            type: 'medication',
            message: `${medication.name} course completed. Consult doctor if symptoms persist.`,
            priority: 'medium'
          });
        }
      });
    }

    res.json({
      message: 'Dashboard data retrieved successfully',
      patient: {
        id: patient._id,
        name: patient.user.fullName,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        bmi: patient.bmi,
        lastUpdated: patient.updatedAt
      },
      appointments: {
        recent: recentAppointments,
        upcoming: upcomingAppointments.slice(0, 3)
      },
      healthRecords: recentHealthRecords,
      healthMetrics,
      reminders
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard' });
  }
};

// Get patient's health summary
const getHealthSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const patient = await Patient.findOne({ user: userId }).populate('user');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Aggregate health data
    const healthSummary = {
      personalInfo: {
        name: patient.user.fullName,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        height: patient.height,
        weight: patient.weight,
        bmi: patient.bmi
      },
      medicalHistory: patient.medicalHistory || [],
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      currentMedications: patient.currentMedications || [],
      emergencyContact: patient.user.emergencyContact,
      lastUpdated: patient.updatedAt
    };

    res.json({
      message: 'Health summary retrieved successfully',
      healthSummary
    });

  } catch (error) {
    console.error('Health summary error:', error);
    res.status(500).json({ message: 'Error loading health summary' });
  }
};

// Update patient health information
const updateHealthInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // Allowed fields for health info update
    const allowedFields = [
      'height', 'weight', 'allergies', 'chronicConditions', 
      'currentMedications', 'medicalHistory'
    ];

    // Filter and validate update data
    const filteredData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const patient = await Patient.findOneAndUpdate(
      { user: userId },
      { $set: filteredData },
      { new: true, runValidators: true }
    ).populate('user');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      message: 'Health information updated successfully',
      patient: {
        id: patient._id,
        name: patient.user.fullName,
        healthInfo: {
          height: patient.height,
          weight: patient.weight,
          bmi: patient.bmi,
          allergies: patient.allergies,
          chronicConditions: patient.chronicConditions,
          currentMedications: patient.currentMedications
        }
      }
    });

  } catch (error) {
    console.error('Update health info error:', error);
    res.status(500).json({ message: 'Error updating health information' });
  }
};

module.exports = {
  getDashboard,
  getHealthSummary,
  updateHealthInfo
};