const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN PROFILE ROUTES
 * Registered under /api/admin/profile in server.js
 */

// GET: Get self profile
router.get('/me', protect, admin, profileController.getAdminProfile);

// PUT: Update self profile details
router.put('/update', protect, admin, profileController.updateAdminProfile);

// PUT: Update self password
router.put('/password', protect, admin, profileController.updateAdminPassword);

module.exports = router;