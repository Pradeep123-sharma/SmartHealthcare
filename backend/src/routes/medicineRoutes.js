const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authenticate = require('../middlewares/authMiddleware');

// Route to get all medicines
router.get('/', authenticate, medicineController.getAllMedicines);

// Route to get a medicine by ID
router.get('/:id', authenticate, medicineController.getMedicineById);

// Route to add a new medicine
router.post('/', authenticate, medicineController.addMedicine);

// Route to update a medicine by ID
router.put('/:id', authenticate, medicineController.updateMedicine);

// Route to delete a medicine by ID
router.delete('/:id', authenticate, medicineController.deleteMedicine);

// Route to get all unique medicine categories
router.get('/categories', authenticate, medicineController.getMedicineCategories);

module.exports = router;