// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// This defines https://green-valley-apartment-complaint.onrender.com/api/contact/send-sms
router.post('/send-sms', contactController.sendContactSMS);

module.exports = router;