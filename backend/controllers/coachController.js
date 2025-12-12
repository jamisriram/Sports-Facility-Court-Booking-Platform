const Coach = require('../models/Coach');

/**
 * Get all coaches
 */
const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: coaches.length,
            coaches
        });
    } catch (error) {
        console.error('Get coaches error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching coaches',
            error: error.message
        });
    }
};

/**
 * Get coach by ID
 */
const getCoachById = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);

        if (!coach) {
            return res.status(404).json({
                success: false,
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            success: true,
            coach
        });
    } catch (error) {
        console.error('Get coach error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching coach',
            error: error.message
        });
    }
};

/**
 * Create a new coach (Admin)
 */
const createCoach = async (req, res) => {
    try {
        const { name, specialization, hourlyRate, isAvailable } = req.body;

        const coach = new Coach({
            name,
            specialization,
            hourlyRate,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        await coach.save();

        res.status(201).json({
            success: true,
            message: 'Coach created successfully',
            coach
        });
    } catch (error) {
        console.error('Create coach error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating coach',
            error: error.message
        });
    }
};

/**
 * Update a coach (Admin)
 */
const updateCoach = async (req, res) => {
    try {
        const { name, specialization, hourlyRate, isAvailable } = req.body;

        const coach = await Coach.findByIdAndUpdate(
            req.params.id,
            { name, specialization, hourlyRate, isAvailable },
            { new: true, runValidators: true }
        );

        if (!coach) {
            return res.status(404).json({
                success: false,
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coach updated successfully',
            coach
        });
    } catch (error) {
        console.error('Update coach error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating coach',
            error: error.message
        });
    }
};

/**
 * Delete a coach (Admin)
 */
const deleteCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);

        if (!coach) {
            return res.status(404).json({
                success: false,
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coach deleted successfully'
        });
    } catch (error) {
        console.error('Delete coach error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting coach',
            error: error.message
        });
    }
};

module.exports = {
    getAllCoaches,
    getCoachById,
    createCoach,
    updateCoach,
    deleteCoach
};
