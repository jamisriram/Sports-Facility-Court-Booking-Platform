const Court = require('../models/Court');

/**
 * Get all courts
 */
const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: courts.length,
            courts
        });
    } catch (error) {
        console.error('Get courts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching courts',
            error: error.message
        });
    }
};

/**
 * Get court by ID
 */
const getCourtById = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        res.status(200).json({
            success: true,
            court
        });
    } catch (error) {
        console.error('Get court error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching court',
            error: error.message
        });
    }
};

/**
 * Create a new court (Admin)
 */
const createCourt = async (req, res) => {
    try {
        const { name, type, basePrice, isActive } = req.body;

        const court = new Court({
            name,
            type,
            basePrice,
            isActive: isActive !== undefined ? isActive : true
        });

        await court.save();

        res.status(201).json({
            success: true,
            message: 'Court created successfully',
            court
        });
    } catch (error) {
        console.error('Create court error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating court',
            error: error.message
        });
    }
};

/**
 * Update a court (Admin)
 */
const updateCourt = async (req, res) => {
    try {
        const { name, type, basePrice, isActive } = req.body;

        const court = await Court.findByIdAndUpdate(
            req.params.id,
            { name, type, basePrice, isActive },
            { new: true, runValidators: true }
        );

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Court updated successfully',
            court
        });
    } catch (error) {
        console.error('Update court error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating court',
            error: error.message
        });
    }
};

/**
 * Delete a court (Admin)
 */
const deleteCourt = async (req, res) => {
    try {
        const court = await Court.findByIdAndDelete(req.params.id);

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Court deleted successfully'
        });
    } catch (error) {
        console.error('Delete court error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting court',
            error: error.message
        });
    }
};

module.exports = {
    getAllCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt
};
