const express = require('express');
const router = express.Router();
const { 
    getAllContacts, 
    addContact, 
    updateContact, 
    toggleContactStatus, 
    deleteContact 
} = require('../controllers/emergencyController');
const { protect, admin } = require('../../middleware/authMiddleware');

/**
 * ADMIN EMERGENCY CONTACT ROUTES
 */

router.get('/', protect, admin, getAllContacts);
router.post('/', protect, admin, addContact);
router.put('/:id', protect, admin, updateContact);
router.patch('/:id/status', protect, admin, toggleContactStatus);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;