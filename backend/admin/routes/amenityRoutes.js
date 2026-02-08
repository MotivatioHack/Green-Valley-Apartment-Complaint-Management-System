const express = require('express');
const router = express.Router();
const { 
    getAllAmenities, 
    addAmenity, 
    updateAmenity, 
    toggleAmenityStatus, 
    deleteAmenity 
} = require('../controllers/amenityController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * AMENITY MANAGEMENT ROUTES
 */

// Fetch all amenities
router.get('/', protect, admin, getAllAmenities);

// Add a new amenity
router.post('/', protect, admin, addAmenity);

// Update details of an existing amenity
router.put('/:id', protect, admin, updateAmenity);

// Toggle status (Available/Closed)
// FIXED: Changed toggleContactStatus to toggleAmenityStatus
router.patch('/:id/status', protect, admin, toggleAmenityStatus);

// Delete an amenity
router.delete('/:id', protect, admin, deleteAmenity);

module.exports = router;