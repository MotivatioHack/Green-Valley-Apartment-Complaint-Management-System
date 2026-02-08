const express = require('express');
const router = express.Router();
const { 
    getAllResidents, 
    updateResidentStatus, 
    deleteResident 
} = require('../controllers/residentController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN RESIDENT MANAGEMENT ROUTES
 * All routes are protected and restricted to ADMIN role
 */

// GET: Fetch all residents with their complaint counts
router.get('/', protect, admin, getAllResidents);

// PUT: Toggle resident active/inactive status
router.put('/:id/status', protect, admin, updateResidentStatus);

// DELETE: Remove a resident from the system
router.delete('/:id', protect, admin, deleteResident);

module.exports = router;