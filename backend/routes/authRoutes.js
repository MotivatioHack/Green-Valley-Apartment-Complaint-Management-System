const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new resident (Default role: USER)
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate resident/admin & return JWT with role
router.post('/login', authController.login);

// Optional: Add a 'Get Me' route to verify the token on page refresh
// router.get('/me', verifyToken, authController.getMe);

module.exports = router;