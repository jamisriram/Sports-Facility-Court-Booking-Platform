const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking,
    getBookingById
} = require('../controllers/bookingController');

// User routes
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/:id', getBookingById);
router.delete('/:id', cancelBooking);

// Admin routes
router.get('/', getAllBookings);

module.exports = router;
