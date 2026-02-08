const express = require('express');
const router = express.Router();
const { 
    getAllAmenityBookings, 
    updateBookingStatus,
    setAmenityDowntime // ✅ Added to the import list to fix ReferenceError
} = require('../controllers/amenityBookingController');
const { protect, admin } = require('../../middleware/authMiddleware');

// Route for fetching the booking list (and triggering auto-expiry)
router.get('/', protect, admin, getAllAmenityBookings);

// Route for approving/rejecting/cancelling with remarks
router.patch('/:id/status', protect, admin, updateBookingStatus);

// Route for scheduling maintenance/downtime
router.post('/downtime', protect, admin, setAmenityDowntime);

module.exports = router;