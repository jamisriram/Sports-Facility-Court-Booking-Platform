const express = require('express');
const router = express.Router();
const {
    getAllPricingRules,
    getPricingRuleById,
    createPricingRule,
    updatePricingRule,
    deletePricingRule
} = require('../controllers/pricingRuleController');

// Public routes
router.get('/', getAllPricingRules);
router.get('/:id', getPricingRuleById);

// Admin routes
router.post('/', createPricingRule);
router.put('/:id', updatePricingRule);
router.delete('/:id', deletePricingRule);

module.exports = router;
