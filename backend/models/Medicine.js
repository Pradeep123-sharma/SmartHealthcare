const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['antibiotic', 'painkiller', 'vitamin', 'supplement', 'prescription', 'otc', 'other'],
    required: true
  },
  description: String,
  activeIngredients: [String],
  dosageForms: [{
    form: { type: String, enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops'] },
    strength: String,
    price: Number
  }],
  sideEffects: [String],
  contraindications: [String],
  interactions: [String],
  prescriptionRequired: {
    type: Boolean,
    default: true
  },
  ageRestrictions: {
    minAge: Number,
    maxAge: Number
  },
  pregnancyCategory: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'X']
  },
  storage: String,
  expiryMonths: Number,
  availability: [{
    pharmacy: String,
    location: String,
    price: Number,
    stock: Number,
    lastUpdated: { type: Date, default: Date.now }
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);