const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @route   GET /api/user/profile
 * @desc    Get current logged-in user's profile
 * @access  Private
 */
router.get('/', verifyToken, profileController.getProfile);
router.get('/navbar', verifyToken, profileController.getNavbarProfile);
/**
 * @route   PUT /api/user/profile
 * @desc    Update current logged-in user's profile
 * @access  Private
 */
router.put('/', verifyToken, profileController.updateProfile);

module.exports = router;