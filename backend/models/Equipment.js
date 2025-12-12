const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['racket', 'shoes'],
        required: [true, 'Equipment type is required']
    },
    totalStock: {
        type: Number,
        required: [true, 'Total stock is required'],
        min: [0, 'Stock cannot be negative']
    },
    availableStock: {
        type: Number,
        required: [true, 'Available stock is required'],
        min: [0, 'Stock cannot be negative']
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'Price per unit is required'],
        min: [0, 'Price cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validation to ensure availableStock doesn't exceed totalStock
equipmentSchema.pre('save', function (next) {
    if (this.availableStock > this.totalStock) {
        this.availableStock = this.totalStock;
    }
    next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);
