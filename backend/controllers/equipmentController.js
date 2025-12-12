const Equipment = require('../models/Equipment');

/**
 * Get all equipment
 */
const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find().sort({ type: 1 });

        res.status(200).json({
            success: true,
            count: equipment.length,
            equipment
        });
    } catch (error) {
        console.error('Get equipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching equipment',
            error: error.message
        });
    }
};

/**
 * Get equipment by ID
 */
const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.status(200).json({
            success: true,
            equipment
        });
    } catch (error) {
        console.error('Get equipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching equipment',
            error: error.message
        });
    }
};

/**
 * Create new equipment (Admin)
 */
const createEquipment = async (req, res) => {
    try {
        const { type, totalStock, pricePerUnit } = req.body;

        const equipment = new Equipment({
            type,
            totalStock,
            availableStock: totalStock, // Initially all stock is available
            pricePerUnit
        });

        await equipment.save();

        res.status(201).json({
            success: true,
            message: 'Equipment created successfully',
            equipment
        });
    } catch (error) {
        console.error('Create equipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating equipment',
            error: error.message
        });
    }
};

/**
 * Update equipment (Admin)
 */
const updateEquipment = async (req, res) => {
    try {
        const { type, totalStock, availableStock, pricePerUnit } = req.body;

        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            { type, totalStock, availableStock, pricePerUnit },
            { new: true, runValidators: true }
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Equipment updated successfully',
            equipment
        });
    } catch (error) {
        console.error('Update equipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating equipment',
            error: error.message
        });
    }
};

/**
 * Delete equipment (Admin)
 */
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        console.error('Delete equipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting equipment',
            error: error.message
        });
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};
