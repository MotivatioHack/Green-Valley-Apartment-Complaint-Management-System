const express = require('express');
const router = express.Router();
// ✅ Relative path verified
const amenityController = require('../controllers/amenityController');
const { verifyToken } = require('../../middleware/authMiddleware');

// Route Registration
router.get('/', verifyToken, amenityController.getAmenities);
router.post('/book', verifyToken, amenityController.createBooking);
router.get('/my-bookings', verifyToken, amenityController.getUserBookings);
router.patch('/bookings/:id', verifyToken, amenityController.updateBookingStatus);

module.exports = router;