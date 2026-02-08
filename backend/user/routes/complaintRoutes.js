const express = require('express');
const router = express.Router();

const complaintController = require('../controllers/complaintController'); 
const { verifyToken } = require('../../middleware/authMiddleware'); 

// POST /api/complaints/raise
router.post('/raise', verifyToken, complaintController.raiseComplaint);

// GET /api/complaints/my
router.get('/my', verifyToken, complaintController.getUserComplaints);

module.exports = router;