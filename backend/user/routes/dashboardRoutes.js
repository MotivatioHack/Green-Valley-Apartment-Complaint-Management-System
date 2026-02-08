const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); 
const { verifyToken } = require('../../middleware/authMiddleware'); 

// This creates the endpoint: GET /api/user/dashboard/overview
router.get('/overview', verifyToken, dashboardController.getUserOverview);

module.exports = router;