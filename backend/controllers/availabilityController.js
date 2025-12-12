const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

/**
 * Check if a court is available for the given time slot
 */
const checkCourtAvailability = async (courtId, startTime, endTime, excludeBookingId = null) => {
    const query = {
        court: courtId,
        status: 'confirmed',
        $or: [
            // New booking starts during an existing booking
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    };

    // Exclude a specific booking (useful for updates)
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await Booking.findOne(query);
    return !existingBooking; // true if available, false if taken
};

/**
 * Check if a coach is available for the given time slot
 */
const checkCoachAvailability = async (coachId, startTime, endTime, excludeBookingId = null) => {
    if (!coachId) return true; // No coach requested, so available

    const query = {
        'resources.coach': coachId,
        status: 'confirmed',
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await Booking.findOne(query);
    return !existingBooking;
};

/**
 * Check if equipment is available in sufficient quantity
 */
const checkEquipmentAvailability = async (equipmentRequests, startTime, endTime) => {
    // equipmentRequests: { rackets: 2, shoes: 1 }

    for (const [type, requestedQty] of Object.entries(equipmentRequests)) {
        if (requestedQty === 0) continue;

        // Get the equipment record
        const equipment = await Equipment.findOne({ type });
        if (!equipment) {
            return { available: false, message: `${type} not found in inventory` };
        }

        // Count how many are already booked during this time slot
        const bookings = await Booking.find({
            status: 'confirmed',
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        let bookedQty = 0;
        bookings.forEach(booking => {
            bookedQty += booking.resources[type] || 0;
        });

        const availableQty = equipment.totalStock - bookedQty;

        if (availableQty < requestedQty) {
            return {
                available: false,
                message: `Only ${availableQty} ${type} available for this time slot`
            };
        }
    }

    return { available: true };
};

/**
 * Check availability of all resources (court, coach, equipment)
 */
const checkAvailability = async (req, res) => {
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

        // Validate time range
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'End time must be after start time'
            });
        }

        // Check court availability
        const courtAvailable = await checkCourtAvailability(courtId, start, end);
        if (!courtAvailable) {
            return res.status(200).json({
                success: false,
                available: false,
                message: 'Court is not available for the selected time slot'
            });
        }

        // Check coach availability
        const coachAvailable = await checkCoachAvailability(coachId, start, end);
        if (!coachAvailable) {
            return res.status(200).json({
                success: false,
                available: false,
                message: 'Coach is not available for the selected time slot'
            });
        }

        // Check equipment availability
        const equipmentCheck = await checkEquipmentAvailability(
            { rackets, shoes },
            start,
            end
        );
        if (!equipmentCheck.available) {
            return res.status(200).json({
                success: false,
                available: false,
                message: equipmentCheck.message
            });
        }

        // All resources are available
        res.status(200).json({
            success: true,
            available: true,
            message: 'All resources are available'
        });

    } catch (error) {
        console.error('Availability check error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking availability',
            error: error.message
        });
    }
};

module.exports = {
    checkAvailability,
    checkCourtAvailability,
    checkCoachAvailability,
    checkEquipmentAvailability
};
