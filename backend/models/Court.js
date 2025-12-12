const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Court name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['indoor', 'outdoor'],
        required: [true, 'Court type is required']
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
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

module.exports = mongoose.model('Court', courtSchema);
