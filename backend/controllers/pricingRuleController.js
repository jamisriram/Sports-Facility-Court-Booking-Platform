const PricingRule = require('../models/PricingRule');

/**
 * Get all pricing rules
 */
const getAllPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rules.length,
            rules
        });
    } catch (error) {
        console.error('Get pricing rules error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pricing rules',
            error: error.message
        });
    }
};

/**
 * Get pricing rule by ID
 */
const getPricingRuleById = async (req, res) => {
    try {
        const rule = await PricingRule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: 'Pricing rule not found'
            });
        }

        res.status(200).json({
            success: true,
            rule
        });
    } catch (error) {
        console.error('Get pricing rule error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pricing rule',
            error: error.message
        });
    }
};

/**
 * Create a new pricing rule (Admin)
 */
const createPricingRule = async (req, res) => {
    try {
        const {
            name,
            ruleType,
            startTime,
            endTime,
            daysOfWeek,
            multiplier,
            surcharge,
            isActive
        } = req.body;

        const rule = new PricingRule({
            name,
            ruleType,
            startTime,
            endTime,
            daysOfWeek,
            multiplier: multiplier || 1,
            surcharge: surcharge || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        await rule.save();

        res.status(201).json({
            success: true,
            message: 'Pricing rule created successfully',
            rule
        });
    } catch (error) {
        console.error('Create pricing rule error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating pricing rule',
            error: error.message
        });
    }
};

/**
 * Update a pricing rule (Admin)
 */
const updatePricingRule = async (req, res) => {
    try {
        const {
            name,
            ruleType,
            startTime,
            endTime,
            daysOfWeek,
            multiplier,
            surcharge,
            isActive
        } = req.body;

        const rule = await PricingRule.findByIdAndUpdate(
            req.params.id,
            { name, ruleType, startTime, endTime, daysOfWeek, multiplier, surcharge, isActive },
            { new: true, runValidators: true }
        );

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: 'Pricing rule not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pricing rule updated successfully',
            rule
        });
    } catch (error) {
        console.error('Update pricing rule error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating pricing rule',
            error: error.message
        });
    }
};

/**
 * Delete a pricing rule (Admin)
 */
const deletePricingRule = async (req, res) => {
    try {
        const rule = await PricingRule.findByIdAndDelete(req.params.id);

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: 'Pricing rule not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pricing rule deleted successfully'
        });
    } catch (error) {
        console.error('Delete pricing rule error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting pricing rule',
            error: error.message
        });
    }
};

module.exports = {
    getAllPricingRules,
    getPricingRuleById,
    createPricingRule,
    updatePricingRule,
    deletePricingRule
};
