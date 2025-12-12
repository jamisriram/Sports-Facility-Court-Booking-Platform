const express = require('express');
const router = express.Router();
const { checkAvailability } = require('../controllers/availabilityController');
const { calculatePrice } = require('../controllers/pricingController');

// Check multi-resource availability
router.post('/check', checkAvailability);

// Calculate dynamic pricing
router.post('/calculate-price', calculatePrice);

module.exports = router;
