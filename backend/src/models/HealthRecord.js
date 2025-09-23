const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hospital'
    },
    date: {
        type: Date,
        default: Date.now
    },
    symptoms: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    treatment: {
        type: String,
        required: true
    },
    medications: [{
        type: String
    }],
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);