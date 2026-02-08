const pool = require('../../config/db');

/**
 * 1. GET ALL STAFF
 * Fetches all staff members and their workload.
 */
const getAllStaff = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.*, 
                (SELECT COUNT(*) FROM complaints c WHERE c.staff_id = s.id AND c.status != 'Resolved') as assignedComplaints
            FROM staff s
            ORDER BY s.id DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ SQL Error in getAllStaff:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 2. ADD NEW STAFF
 * Logic to insert a staff member with a status the database accepts.
 */
const addStaff = async (req, res) => {
    const { name, email, phone, role, department } = req.body;
    try {
        // We use 'active' which now matches the updated ENUM in your DB
        const query = `
            INSERT INTO staff (name, email, phone, role, department, status) 
            VALUES (?, ?, ?, ?, ?, 'active')
        `;
        const [result] = await pool.query(query, [name, email, phone, role, department]);
        
        res.status(201).json({ 
            id: result.insertId, 
            message: "Staff member added successfully" 
        });
    } catch (error) {
        console.error("❌ SQL Error in addStaff:", error.message);
        res.status(500).json({ message: "Failed to add staff", details: error.message });
    }
};

/**
 * 3. UPDATE STAFF
 */
const updateStaff = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, department } = req.body;
    try {
        const query = `
            UPDATE staff 
            SET name = ?, email = ?, phone = ?, role = ?, department = ? 
            WHERE id = ?
        `;
        await pool.query(query, [name, email, phone, role, department, id]);
        res.status(200).json({ message: "Staff updated" });
    } catch (error) {
        console.error("❌ SQL Error in updateStaff:", error.message);
        res.status(500).json({ message: "Update failed" });
    }
};

/**
 * 4. TOGGLE STATUS
 */
const toggleStaffStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT status FROM staff WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Staff not found" });

        const currentStatus = rows[0].status;
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        
        await pool.query('UPDATE staff SET status = ? WHERE id = ?', [newStatus, id]);
        res.status(200).json({ status: newStatus });
    } catch (error) {
        console.error("❌ SQL Error in toggleStaffStatus:", error.message);
        res.status(500).json({ message: "Status update failed" });
    }
};

/**
 * 5. DELETE STAFF
 */
const deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM staff WHERE id = ?', [id]);
        res.status(200).json({ message: "Staff removed" });
    } catch (error) {
        console.error("❌ SQL Error in deleteStaff:", error.message);
        res.status(500).json({ message: "Delete failed" });
    }
};

module.exports = { getAllStaff, addStaff, updateStaff, deleteStaff, toggleStaffStatus };