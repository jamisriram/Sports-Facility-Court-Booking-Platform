const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Rule name is required'],
        trim: true
    },
    ruleType: {
        type: String,
        enum: ['peak', 'weekend', 'holiday', 'custom'],
        required: [true, 'Rule type is required']
    },
    // For time-based rules (peak hours)
    startTime: {
        type: String, // Format: "HH:MM" (24-hour)
        validate: {
            validator: function (v) {
                return !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM (24-hour)'
        }
    },
    endTime: {
        type: String, // Format: "HH:MM" (24-hour)
        validate: {
            validator: function (v) {
                return !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM (24-hour)'
        }
    },
    // For day-based rules (weekend)
    daysOfWeek: {
        type: [Number], // 0 = Sunday, 6 = Saturday
        validate: {
            validator: function (v) {
                return !v || v.every(day => day >= 0 && day <= 6);
            },
            message: 'Days must be between 0 (Sunday) and 6 (Saturday)'
        }
    },
    // Pricing modification
    multiplier: {
        type: Number,
        min: [0, 'Multiplier cannot be negative'],
        default: 1
    },
    surcharge: {
        type: Number,
        min: [0, 'Surcharge cannot be negative'],
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
