const express = require('express');
const router = express.Router();
const { getSystemReports } = require('../controllers/reportController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN REPORTS ROUTE
 * Provides aggregated analytical data for the dashboard.
 */
router.get('/system', protect, admin, getSystemReports);

module.exports = router;