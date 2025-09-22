const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['government', 'private', 'charitable', 'specialty'],
    required: true
  },
  specialties: [String],
  contact: {
    phone: { type: String, required: true },
    email: String,
    emergencyNumber: String
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  facilities: [{
    name: String,
    available: { type: Boolean, default: true },
    capacity: Number,
    currentOccupancy: Number
  }],
  services: [{
    name: String,
    department: String,
    available24x7: { type: Boolean, default: false },
    cost: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    }
  }],
  emergencyServices: {
    ambulance: { type: Boolean, default: false },
    trauma: { type: Boolean, default: false },
    cardiac: { type: Boolean, default: false },
    pediatric: { type: Boolean, default: false },
    maternity: { type: Boolean, default: false }
  },
  accreditation: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  operatingHours: {
    weekdays: { open: String, close: String },
    weekends: { open: String, close: String },
    emergency24x7: { type: Boolean, default: false }
  },
  insurance: [String],
  bedCapacity: {
    general: Number,
    icu: Number,
    emergency: Number
  },
  currentStatus: {
    bedsAvailable: Number,
    emergencyWaitTime: Number, // in minutes
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);