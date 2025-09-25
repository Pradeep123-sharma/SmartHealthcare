const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const patientRoutes = require('./routes/patientRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/emergency', emergencyRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;