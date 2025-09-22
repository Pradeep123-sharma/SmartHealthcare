const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  emergencyType: {
    type: String,
    enum: ['medical', 'accident', 'cardiac', 'respiratory', 'trauma', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String,
    landmark: String
  },
  status: {
    type: String,
    enum: ['active', 'responded', 'resolved', 'cancelled'],
    default: 'active'
  },
  contacts: [{
    name: String,
    phone: String,
    relation: String,
    notified: { type: Boolean, default: false },
    notifiedAt: Date
  }],
  responders: [{
    type: { type: String, enum: ['ambulance', 'hospital', 'doctor', 'volunteer'] },
    name: String,
    phone: String,
    estimatedArrival: Date,
    status: { type: String, enum: ['notified', 'dispatched', 'arrived', 'completed'] }
  }],
  vitals: {
    consciousness: { type: String, enum: ['conscious', 'unconscious', 'semi-conscious'] },
    breathing: { type: String, enum: ['normal', 'difficulty', 'stopped'] },
    pulse: { type: String, enum: ['normal', 'weak', 'strong', 'absent'] },
    bleeding: { type: Boolean, default: false }
  },
  resolvedAt: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Emergency', emergencySchema);