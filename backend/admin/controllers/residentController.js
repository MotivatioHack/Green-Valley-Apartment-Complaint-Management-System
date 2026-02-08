const pool = require('../../config/db');

/**
 * 1. GET ALL RESIDENTS
 * Fetches users with role 'USER' and calculates total complaints raised.
 * Note: Mapping 'tower_number' from DB to 'block' for the frontend.
 */
const getAllResidents = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.phone, 
                u.flat_number AS flatNo, 
                u.tower_number AS block, 
                u.status, 
                u.created_at AS joinedAt,
                COUNT(c.id) AS complaintCount
            FROM users u
            LEFT JOIN complaints c ON u.id = c.user_id
            WHERE u.role = 'USER'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;
        const [rows] = await pool.query(query);
        
        // Return results as an array or an empty array if no data exists
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        // Log specific SQL errors to the terminal for debugging
        console.error("❌ Admin GetAllResidents Error:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 2. UPDATE RESIDENT STATUS
 * Toggles access between 'active' and 'inactive' for residents.
 */
const updateResidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expects 'active', 'inactive', or 'pending'

    try {
        const query = 'UPDATE users SET status = ? WHERE id = ? AND role = "USER"';
        await pool.query(query, [status, id]);
        
        res.status(200).json({ message: "Resident status updated successfully" });
    } catch (error) {
        console.error("❌ Admin UpdateResidentStatus Error:", error.message);
        res.status(500).json({ message: "Failed to update status" });
    }
};

/**
 * 3. DELETE RESIDENT
 * Permanently removes a resident account from the system.
 */
const deleteResident = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE id = ? AND role = "USER"';
        await pool.query(query, [id]);
        
        res.status(200).json({ message: "Resident removed successfully" });
    } catch (error) {
        console.error("❌ Admin DeleteResident Error:", error.message);
        res.status(500).json({ message: "Failed to delete resident" });
    }
};

module.exports = {
    getAllResidents,
    updateResidentStatus,
    deleteResident
};