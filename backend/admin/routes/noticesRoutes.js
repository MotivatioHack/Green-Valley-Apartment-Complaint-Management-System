const express = require('express');
const router = express.Router();
const { 
    getAllNotices, 
    createNotice, 
    updateNotice, 
    deleteNotice, 
    toggleNoticeVisibility 
} = require('../controllers/noticesController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN NOTICE MANAGEMENT ROUTES
 */

// GET: Fetch all notices for admin view
router.get('/', protect, admin, getAllNotices);

// POST: Create a new notice
router.post('/', protect, admin, createNotice);

// PUT: Update an existing notice
router.put('/:id', protect, admin, updateNotice);

// DELETE: Permanent removal of a notice
router.delete('/:id', protect, admin, deleteNotice);

// PATCH: Toggle visibility (Active/Inactive)
router.patch('/:id/visibility', protect, admin, toggleNoticeVisibility);

module.exports = router;