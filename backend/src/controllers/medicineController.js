const medicineService = require('../services/medicineService');

// Create a new medicine
exports.addMedicine = async (req, res) => {
    try {
        const medicine = await medicineService.createMedicine(req.body);
        res.status(201).json({ message: 'Medicine created successfully', medicine });
    } catch (error) {
        res.status(400).json({ message: 'Error creating medicine', error });
    }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicineService.getAllMedicines();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicines', error });
    }
};

// Get a medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await medicineService.getMedicineById(req.params.id);
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
        const medicine = await medicineService.updateMedicine(req.params.id, req.body);
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
        const medicine = await medicineService.deleteMedicine(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};

// Get all unique medicine categories
exports.getMedicineCategories = async (req, res, next) => {
    try {
        const categories = await medicineService.getMedicineCategories();
        res.status(200).json({ categories });
    } catch (error) {
        next(error);
    }
};