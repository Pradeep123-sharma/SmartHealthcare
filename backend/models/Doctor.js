const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  qualification: [{
    degree: String,
    institution: String,
    year: Number
  }],
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: { type: Boolean, default: true }
    }]
  }],
  hospital: {
    name: String,
    address: String,
    city: String,
    state: String
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  languages: [{
    type: String,
    enum: ['en', 'hi']
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  telemedicine: {
    enabled: { type: Boolean, default: true },
    platforms: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);