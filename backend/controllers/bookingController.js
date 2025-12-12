const Booking = require('../models/Booking');
const User = require('../models/User');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const { checkCourtAvailability, checkCoachAvailability, checkEquipmentAvailability } = require('./availabilityController');

/**
 * Create a new booking
 */
const createBooking = async (req, res) => {
    try {
        const {
            userId,
            courtId,
            coachId,
            startTime,
            endTime,
            rackets = 0,
            shoes = 0,
            pricingBreakdown
        } = req.body;

        // Validate required fields
        if (!userId || !courtId || !startTime || !endTime || !pricingBreakdown) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Double-check availability before booking
        const courtAvailable = await checkCourtAvailability(courtId, start, end);
        if (!courtAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Court is no longer available for the selected time slot'
            });
        }

        const coachAvailable = await checkCoachAvailability(coachId, start, end);
        if (!coachAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Coach is no longer available for the selected time slot'
            });
        }

        const equipmentCheck = await checkEquipmentAvailability(
            { rackets, shoes },
            start,
            end
        );
        if (!equipmentCheck.available) {
            return res.status(400).json({
                success: false,
                message: equipmentCheck.message
            });
        }

        // Create the booking
        const booking = new Booking({
            user: userId,
            court: courtId,
            startTime: start,
            endTime: end,
            resources: {
                rackets,
                shoes,
                coach: coachId || null
            },
            status: 'confirmed',
            pricingBreakdown
        });

        await booking.save();

        // Populate references for response
        await booking.populate('user court resources.coach');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating booking',
            error: error.message
        });
    }
};

/**
 * Get all bookings for a specific user
 */
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ user: userId })
            .populate('court resources.coach')
            .sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings',
            error: error.message
        });
    }
};

/**
 * Get all bookings (Admin)
 */
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user court resources.coach')
            .sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings',
            error: error.message
        });
    }
};

/**
 * Cancel a booking
 */
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while cancelling booking',
            error: error.message
        });
    }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('user court resources.coach');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching booking',
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking,
    getBookingById
};
