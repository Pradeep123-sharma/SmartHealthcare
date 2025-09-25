const Medicine = require('../models/Medicine');

// Create a new medicine
const createMedicine = async (medicineData) => {
    try {
        const medicine = new Medicine(medicineData);
        await medicine.save();
        return medicine;
    } catch (error) {
        throw new Error('Error creating medicine: ' + error.message);
    }
};

// Get all medicines
const getAllMedicines = async () => {
    try {
        const medicines = await Medicine.find();
        return medicines;
    } catch (error) {
        throw new Error('Error fetching medicines: ' + error.message);
    }
};

// Get medicine by ID
const getMedicineById = async (id) => {
    try {
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            throw new Error('Medicine not found');
        }
        return medicine;
    } catch (error) {
        throw new Error('Error fetching medicine: ' + error.message);
    }
};

// Update medicine by ID
const updateMedicine = async (id, medicineData) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(id, medicineData, { new: true });
        if (!medicine) {
            throw new Error('Medicine not found');
        }
        return medicine;
    } catch (error) {
        throw new Error('Error updating medicine: ' + error.message);
    }
};

// Delete medicine by ID
const deleteMedicine = async (id) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(id);
        if (!medicine) {
            throw new Error('Medicine not found');
        }
        return medicine;
    } catch (error) {
        throw new Error('Error deleting medicine: ' + error.message);
    }
};

const getMedicineCategories = async () => {
    try {
        const categories = await Medicine.distinct('category');
        return categories;
    } catch (error) {
        throw new Error('Error fetching medicine categories: ' + error.message);
    }
};

module.exports = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
    getMedicineCategories,
};