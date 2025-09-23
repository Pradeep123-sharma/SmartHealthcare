const HealthRecord = require('../models/HealthRecord');

// Create a new health record
exports.createHealthRecord = async (req, res) => {
    try {
        const healthRecord = new HealthRecord(req.body);
        await healthRecord.save();
        res.status(201).json({ message: 'Health record created successfully', healthRecord });
    } catch (error) {
        res.status(400).json({ message: 'Error creating health record', error });
    }
};

// Get all health records
exports.getAllHealthRecords = async (req, res) => {
    try {
        const healthRecords = await HealthRecord.find();
        res.status(200).json(healthRecords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching health records', error });
    }
};

// Get a health record by ID
exports.getHealthRecordById = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }
        res.status(200).json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching health record', error });
    }
};

// Update a health record by ID
exports.updateHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }
        res.status(200).json({ message: 'Health record updated successfully', healthRecord });
    } catch (error) {
        res.status(400).json({ message: 'Error updating health record', error });
    }
};

// Delete a health record by ID
exports.deleteHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByIdAndDelete(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }
        res.status(200).json({ message: 'Health record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting health record', error });
    }
};