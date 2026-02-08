const express = require('express');
const router = express.Router();
const { 
    getAllStaff, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    toggleStaffStatus 
} = require('../controllers/staffController');
const { protect, admin } = require('../../middleware/authMiddleware');

// Base path: /api/admin/staff
router.get('/', protect, admin, getAllStaff);
router.post('/', protect, admin, addStaff);
router.put('/:id', protect, admin, updateStaff);
router.delete('/:id', protect, admin, deleteStaff);
router.patch('/:id/status', protect, admin, toggleStaffStatus);

module.exports = router;