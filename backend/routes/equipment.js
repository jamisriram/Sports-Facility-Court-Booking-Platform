const express = require('express');
const router = express.Router();
const {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
} = require('../controllers/equipmentController');

// Public routes
router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Admin routes
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

module.exports = router;
