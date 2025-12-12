const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: [true, 'Court is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    // Optional resources
    resources: {
        rackets: {
            type: Number,
            default: 0,
            min: [0, 'Rackets cannot be negative']
        },
        shoes: {
            type: Number,
            default: 0,
            min: [0, 'Shoes cannot be negative']
        },
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coach',
            default: null
        }
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    pricingBreakdown: {
        basePrice: {
            type: Number,
            required: true,
            min: 0
        },
        peakHourFee: {
            type: Number,
            default: 0,
            min: 0
        },
        weekendFee: {
            type: Number,
            default: 0,
            min: 0
        },
        equipmentFee: {
            type: Number,
            default: 0,
            min: 0
        },
        coachFee: {
            type: Number,
            default: 0,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validation to ensure endTime is after startTime
bookingSchema.pre('save', function (next) {
    if (this.endTime <= this.startTime) {
        next(new Error('End time must be after start time'));
    }
    next();
});

// Index for efficient availability queries
bookingSchema.index({ court: 1, startTime: 1, endTime: 1, status: 1 });
bookingSchema.index({ 'resources.coach': 1, startTime: 1, endTime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
