const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'lab-report', 'imaging', 'consultation', 'vaccination', 'surgery', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  hospital: String,
  date: {
    type: Date,
    required: true
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    status: { type: String, enum: ['normal', 'abnormal', 'critical'] }
  }],
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    oxygenSaturation: Number
  },
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    sharedAt: { type: Date, default: Date.now },
    expiresAt: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);