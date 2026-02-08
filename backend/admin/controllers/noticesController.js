const pool = require('../../config/db');

/**
 * 1. GET ALL NOTICES
 * Fetches all society notices sorted by the latest first.
 */
const getAllNotices = async (req, res) => {
    try {
        const query = 'SELECT * FROM notices ORDER BY created_at DESC';
        const [rows] = await pool.query(query);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ SQL Error in getAllNotices:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 2. CREATE NOTICE
 * Adds a new notice and maps the priority logic to the 'pinned' column.
 */
const createNotice = async (req, res) => {
    const { title, description, type, date, pinned } = req.body;
    try {
        // Normalizing type to match DB ENUM values
        const validUnitType = (type || 'info').toLowerCase();
        
        // Pinned maps to UI Priority: 1 for Important/Urgent, 0 for Normal
        const pinnedValue = pinned !== undefined ? pinned : 0;

        const query = `
            INSERT INTO notices (title, description, type, date, status, pinned) 
            VALUES (?, ?, ?, ?, 'active', ?)
        `;
        const [result] = await pool.query(query, [title, description, validUnitType, date, pinnedValue]);
        
        res.status(201).json({ id: result.insertId, message: "Notice published successfully" });
    } catch (error) {
        console.error("❌ SQL Error in createNotice:", error.message);
        res.status(500).json({ message: "Failed to publish notice", details: error.message });
    }
};

/**
 * 3. UPDATE NOTICE
 * Persists changes including the mapped Priority (pinned) state.
 */
const updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, description, type, date, pinned } = req.body;
    try {
        const validUnitType = (type || 'info').toLowerCase();
        const pinnedValue = pinned !== undefined ? pinned : 0;

        const query = `
            UPDATE notices 
            SET title = ?, description = ?, type = ?, date = ?, pinned = ? 
            WHERE id = ?
        `;
        await pool.query(query, [title, description, validUnitType, date, pinnedValue, id]);
        
        res.status(200).json({ message: "Notice updated successfully" });
    } catch (error) {
        console.error("❌ SQL Error in updateNotice:", error.message);
        res.status(500).json({ message: "Update failed", details: error.message });
    }
};

/**
 * 4. TOGGLE VISIBILITY
 * Switches notice between 'active' and 'inactive' status.
 */
const toggleNoticeVisibility = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT status FROM notices WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Notice not found" });

        const newStatus = rows[0].status === 'active' ? 'inactive' : 'active';

        await pool.query('UPDATE notices SET status = ? WHERE id = ?', [newStatus, id]);
        res.status(200).json({ message: "Visibility updated", status: newStatus });
    } catch (error) {
        console.error("❌ SQL Error in toggleNoticeVisibility:", error.message);
        res.status(500).json({ message: "Toggle failed" });
    }
};

/**
 * 5. DELETE NOTICE
 * Permanently removes a notice from the database.
 */
const deleteNotice = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notices WHERE id = ?', [id]);
        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.error("❌ SQL Error in deleteNotice:", error.message);
        res.status(500).json({ message: "Delete failed" });
    }
};

module.exports = {
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    toggleNoticeVisibility
};