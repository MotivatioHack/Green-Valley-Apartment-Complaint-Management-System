const express = require('express');
const router = express.Router();
const navbarController = require('../controllers/navbarController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN NAVBAR ROUTES
 * Registered under /api/admin/navbar in server.js
 */

router.get('/data', protect, admin, navbarController.getNavbarData);

module.exports = router;