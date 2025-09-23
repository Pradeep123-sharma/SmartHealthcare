const HealthRecord = require('../models/HealthRecord');

// Create a new health record
const createHealthRecord = async (data) => {
    try {
        const healthRecord = new HealthRecord(data);
        await healthRecord.save();
        return healthRecord;
    } catch (error) {
        throw new Error('Error creating health record: ' + error.message);
    }
};

// Get health records by patient ID
const getHealthRecordsByPatientId = async (patientId) => {
    try {
        const records = await HealthRecord.find({ patientId });
        return records;
    } catch (error) {
        throw new Error('Error fetching health records: ' + error.message);
    }
};

// Update a health record by ID
const updateHealthRecord = async (id, data) => {
    try {
        const updatedRecord = await HealthRecord.findByIdAndUpdate(id, data, { new: true });
        return updatedRecord;
    } catch (error) {
        throw new Error('Error updating health record: ' + error.message);
    }
};

// Delete a health record by ID
const deleteHealthRecord = async (id) => {
    try {
        await HealthRecord.findByIdAndDelete(id);
        return { message: 'Health record deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting health record: ' + error.message);
    }
};

module.exports = {
    createHealthRecord,
    getHealthRecordsByPatientId,
    updateHealthRecord,
    deleteHealthRecord,
};