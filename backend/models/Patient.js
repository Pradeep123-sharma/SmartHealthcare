const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  height: {
    value: Number,
    unit: { type: String, default: 'cm' }
  },
  weight: {
    value: Number,
    unit: { type: String, default: 'kg' }
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    validUntil: Date
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    doctor: String,
    notes: String
  }]
}, {
  timestamps: true
});

// Calculate age from date of birth
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Calculate BMI
patientSchema.virtual('bmi').get(function() {
  if (!this.height?.value || !this.weight?.value) return null;
  
  const heightInMeters = this.height.unit === 'cm' ? this.height.value / 100 : this.height.value;
  const weightInKg = this.weight.unit === 'lb' ? this.weight.value * 0.453592 : this.weight.value;
  
  return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
});

patientSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Patient', patientSchema);