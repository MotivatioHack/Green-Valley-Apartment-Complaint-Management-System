const pool = require('../../config/db');

/**
 * 1. GET ALL CONTACTS
 * Fetches all emergency contacts based on specific schema: role, availability, email.
 */
const getAllContacts = async (req, res) => {
    try {
        const query = 'SELECT id, name, role, phone, email, availability, created_at FROM emergency_contacts ORDER BY created_at DESC';
        const [rows] = await pool.query(query);
        
        // Return rows if they exist, otherwise return an empty array
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ Admin GetAllContacts Error:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 2. ADD CONTACT
 * Maps frontend data to 'role' and 'availability' columns.
 */
const addContact = async (req, res) => {
    const { name, role, phone, email } = req.body;
    try {
        const query = `
            INSERT INTO emergency_contacts (name, role, phone, email, availability) 
            VALUES (?, ?, ?, ?, 'Available')
        `;
        const [result] = await pool.query(query, [
            name, 
            role, 
            phone, 
            email || '' // Handle optional email
        ]);
        
        res.status(201).json({ id: result.insertId, message: "Contact added successfully" });
    } catch (error) {
        console.error("❌ Admin AddContact Error:", error.message);
        res.status(500).json({ message: "Failed to add contact" });
    }
};

/**
 * 3. UPDATE CONTACT
 * Updates existing contact details using correct column names.
 */
const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, role, phone, email } = req.body;
    try {
        const query = `
            UPDATE emergency_contacts 
            SET name = ?, role = ?, phone = ?, email = ? 
            WHERE id = ?
        `;
        await pool.query(query, [
            name, 
            role, 
            phone, 
            email || '', 
            id
        ]);
        
        res.status(200).json({ message: "Contact updated successfully" });
    } catch (error) {
        console.error("❌ Admin UpdateContact Error:", error.message);
        res.status(500).json({ message: "Update failed" });
    }
};

/**
 * 4. TOGGLE AVAILABILITY
 * Toggles 'availability' between 'Available' and 'Unavailable'.
 * Only 'Available' contacts will be visible to residents.
 */
const toggleContactStatus = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch current availability status
        const [rows] = await pool.query('SELECT availability FROM emergency_contacts WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Contact not found" });

        // Switch between Available and Unavailable
        const newStatus = rows[0].availability === 'Available' ? 'Unavailable' : 'Available';
        
        await pool.query('UPDATE emergency_contacts SET availability = ? WHERE id = ?', [newStatus, id]);
        res.status(200).json({ availability: newStatus });
    } catch (error) {
        console.error("❌ Admin ToggleStatus Error:", error.message);
        res.status(500).json({ message: "Toggle failed" });
    }
};

/**
 * 5. DELETE CONTACT
 * Permanently removes contact from the database.
 */
const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM emergency_contacts WHERE id = ?', [id]);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("❌ Admin DeleteContact Error:", error.message);
        res.status(500).json({ message: "Delete failed" });
    }
};

module.exports = {
    getAllContacts,
    addContact,
    updateContact,
    toggleContactStatus,
    deleteContact
};