const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');

/**
 * Calculate the total price for a booking based on dynamic pricing rules
 */
const calculatePrice = async (req, res) => {
    try {
        const { courtId, coachId, startTime, endTime, rackets = 0, shoes = 0 } = req.body;

        // Validate required fields
        if (!courtId || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Court ID, start time, and end time are required'
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Get court base price
        const court = await Court.findById(courtId);
        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        // Calculate duration in hours
        const durationMs = end - start;
        const durationHours = durationMs / (1000 * 60 * 60);

        let basePrice = court.basePrice * durationHours;
        let peakHourFee = 0;
        let weekendFee = 0;
        let equipmentFee = 0;
        let coachFee = 0;

        // Get active pricing rules
        const pricingRules = await PricingRule.find({ isActive: true });

        // Apply pricing rules
        const hour = start.getHours();
        const dayOfWeek = start.getDay(); // 0 = Sunday, 6 = Saturday

        for (const rule of pricingRules) {
            // Check peak hour rules
            if (rule.ruleType === 'peak' && rule.startTime && rule.endTime) {
                const [startHour, startMin] = rule.startTime.split(':').map(Number);
                const [endHour, endMin] = rule.endTime.split(':').map(Number);
                const ruleStartMinutes = startHour * 60 + startMin;
                const ruleEndMinutes = endHour * 60 + endMin;
                const bookingMinutes = hour * 60 + start.getMinutes();

                if (bookingMinutes >= ruleStartMinutes && bookingMinutes < ruleEndMinutes) {
                    if (rule.multiplier > 1) {
                        peakHourFee += basePrice * (rule.multiplier - 1);
                    }
                    if (rule.surcharge > 0) {
                        peakHourFee += rule.surcharge * durationHours;
                    }
                }
            }

            // Check weekend rules
            if (rule.ruleType === 'weekend' && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                if (rule.daysOfWeek.includes(dayOfWeek)) {
                    if (rule.multiplier > 1) {
                        weekendFee += basePrice * (rule.multiplier - 1);
                    }
                    if (rule.surcharge > 0) {
                        weekendFee += rule.surcharge * durationHours;
                    }
                }
            }
        }

        // Calculate equipment fees
        if (rackets > 0) {
            const racketEquipment = await Equipment.findOne({ type: 'racket' });
            if (racketEquipment) {
                equipmentFee += racketEquipment.pricePerUnit * rackets * durationHours;
            }
        }

        if (shoes > 0) {
            const shoesEquipment = await Equipment.findOne({ type: 'shoes' });
            if (shoesEquipment) {
                equipmentFee += shoesEquipment.pricePerUnit * shoes * durationHours;
            }
        }

        // Calculate coach fee
        if (coachId) {
            const coach = await Coach.findById(coachId);
            if (coach && coach.isAvailable) {
                coachFee = coach.hourlyRate * durationHours;
            }
        }

        // Calculate total
        const total = basePrice + peakHourFee + weekendFee + equipmentFee + coachFee;

        const breakdown = {
            basePrice: Math.round(basePrice * 100) / 100,
            peakHourFee: Math.round(peakHourFee * 100) / 100,
            weekendFee: Math.round(weekendFee * 100) / 100,
            equipmentFee: Math.round(equipmentFee * 100) / 100,
            coachFee: Math.round(coachFee * 100) / 100,
            total: Math.round(total * 100) / 100,
            duration: durationHours
        };

        res.status(200).json({
            success: true,
            pricing: breakdown
        });

    } catch (error) {
        console.error('Price calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while calculating price',
            error: error.message
        });
    }
};

module.exports = {
    calculatePrice
};
