const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    services: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;