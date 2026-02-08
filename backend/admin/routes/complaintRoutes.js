const express = require('express');
const router = express.Router();
const { 
    getAllComplaints, 
    updateComplaint, 
    getStaffList 
} = require('../controllers/complaintController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN COMPLAINT MANAGEMENT ROUTES
 * --------------------------------
 * Handles fetching, filtering, and updating society complaints.
 */

// GET: Fetch all complaints with resident and assigned staff details
router.get('/', protect, admin, getAllComplaints);

// GET: Fetch available staff members (filtered by department) for assignment
router.get('/staff', protect, admin, getStaffList);

// PUT: Main update endpoint (Used by the 'All Complaints' management modal)
// Handles status, admin remarks, and staff assignment persistence
router.put('/:id', protect, admin, updateComplaint);

// PUT: Specific status sync (Used by the 'Complaint Control' side panel)
// Matches the frontend fetch path: /api/admin/complaints/status/:id
router.put('/status/:id', protect, admin, updateComplaint);

module.exports = router;