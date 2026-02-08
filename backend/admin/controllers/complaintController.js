const pool = require('../../config/db');

/**
 * 1. GET ALL COMPLAINTS
 * Fetches complaints with resident names and assigned staff details.
 */
const getAllComplaints = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*, 
                u.name as residentName, 
                u.flat_number as flatNo,
                s.name as assignedStaffName
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN staff s ON c.staff_id = s.id
            ORDER BY c.created_at DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ Admin GetAllComplaints Error:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 2. GET FILTERED STAFF
 * Fetches active staff members based on complaint category.
 */
const getStaffList = async (req, res) => {
    const { category } = req.query;
    
    // Mapping complaint categories to staff departments
    const categoryToDept = {
        'plumbing': 'Plumbing',
        'electrical': 'Electrical',
        'garden': 'Maintenance',
        'security': 'Security',
        'parking': 'Maintenance'
    };

    const targetDept = categoryToDept[category?.toLowerCase()] || null;

    try {
        let query = "SELECT id, name, department, role FROM staff WHERE status = 'active'";
        let params = [];

        if (targetDept) {
            // Prioritize matching department but allow others if needed
            query = `
                SELECT id, name, department, role 
                FROM staff 
                WHERE status = 'active' 
                ORDER BY (department = ?) DESC, name ASC
            `;
            params.push(targetDept);
        }

        const [rows] = await pool.query(query, params);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ Admin GetStaffList Error:", error.message);
        res.status(500).json([]);
    }
};

/**
 * 3. UPDATE COMPLAINT (ASSIGNMENT & STATUS)
 * Persists the selected staff member and status updates.
 */
const updateComplaint = async (req, res) => {
    const { id } = req.params;
    const { status, admin_remark, staff_id } = req.body;

    // Standardize status format for DB
    const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    };

    const dbStatus = statusMap[status] || status;

    try {
        const query = `
            UPDATE complaints 
            SET status = ?, 
                admin_remark = ?, 
                staff_id = ? 
            WHERE id = ?
        `;
        const values = [dbStatus, admin_remark, staff_id || null, id];

        await pool.query(query, values);
        res.status(200).json({ message: "Complaint updated and staff assigned" });
    } catch (error) {
        console.error("❌ Admin UpdateComplaint Error:", error.message);
        res.status(500).json({ message: "Database update failed" });
    }
};

module.exports = {
    getAllComplaints,
    getStaffList,
    updateComplaint
};