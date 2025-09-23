const Medicine = require('../models/Medicine');

// Create a new medicine
exports.addMedicine = async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        await medicine.save();
        res.status(201).json({ message: 'Medicine created successfully', medicine });
    } catch (error) {
        res.status(400).json({ message: 'Error creating medicine', error });
    }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicines', error });
    }
};

// Get a medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicine', error });
    }
};

// Update a medicine by ID
exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine updated successfully', medicine });
    } catch (error) {
        res.status(400).json({ message: 'Error updating medicine', error });
    }
};

// Delete a medicine by ID
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};