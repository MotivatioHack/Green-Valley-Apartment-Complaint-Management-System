const express = require('express');
const router = express.Router();
const noticesController = require('../controllers/noticesController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @route   GET /api/notices
 * @desc    Fetch all society notices for the logged-in user
 * @access  Private (Resident/User)
 */
router.get('/', verifyToken, noticesController.getAllNotices);

module.exports = router;