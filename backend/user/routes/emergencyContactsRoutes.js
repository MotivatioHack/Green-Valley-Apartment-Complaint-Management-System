const express = require('express');
const router = express.Router();
const emergencyContactsController = require('../controllers/emergencyContactsController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @route   GET /api/emergency-contacts
 * @desc    Fetch all emergency contacts for the society
 * @access  Private (Authenticated User)
 */
router.get('/', verifyToken, emergencyContactsController.getAllContacts);

module.exports = router;