const pool = require('../../config/db');

// Fetch all complaints with resident details and assigned staff name
const getAllComplaints = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*, 
                u.name as residentName, 
                u.flat_number as flatNo,
                s.name as assignedStaffName
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN staff s ON c.staff_id = s.id
            ORDER BY c.created_at DESC
        `);
        
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("Admin GetAllComplaints Error:", error);
        res.status(500).json([]); 
    }
};

// Fetch list of available staff filtered by complaint category
const getStaffList = async (req, res) => {
    const { category } = req.query;
    try {
        // Simple mapping: if category is plumbing, find plumbers. 
        // If your DB uses different department names, adjust the mapping here.
        let query = 'SELECT id, name, department, status FROM staff WHERE status = "available"';
        const params = [];

        if (category) {
            query += ' AND department = ?';
            params.push(category);
        }

        const [rows] = await pool.query(query, params);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("Admin GetStaffList Error:", error);
        res.status(500).json([]);
    }
};

// Update status, admin remark, and staff assignment
const updateComplaint = async (req, res) => {
    const { id } = req.params;
    const { status, admin_remark, staff_id } = req.body;

    try {
        // Updating these fields here makes them visible in the User Dashboard getUserComplaints API
        await pool.query(
            `UPDATE complaints 
             SET status = ?, admin_remark = ?, staff_id = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, admin_remark, staff_id || null, id]
        );

        res.status(200).json({ message: "Complaint updated successfully" });
    } catch (error) {
        console.error("Admin UpdateComplaint Error:", error);
        res.status(500).json({ message: "Error updating complaint" });
    }
};


// Function for users to raise a new complaint
const raiseComplaint = async (req, res) => {
    const { title, category, description, location, priority } = req.body;
    const userId = req.user.id;

    try {
        const query = `
            INSERT INTO complaints (user_id, title, category, description, location, priority) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [userId, title, category, description, location, priority]);

        return res.status(201).json({ 
            message: "Complaint submitted successfully!", 
            id: result.insertId 
        });
    } catch (error) {
        console.error("User raiseComplaint Error:", error);
        return res.status(500).json({ message: "Failed to submit complaint" });
    }
};

// Function for users to see only their own complaints
const getUserComplaints = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
            SELECT id, title, category, description, status, priority, admin_remark, created_at 
            FROM complaints 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.execute(query, [userId]);
        return res.status(200).json(rows || []);
    } catch (error) {
        console.error("User getUserComplaints Error:", error);
        return res.status(500).json({ message: "Error fetching complaints" });
    }
};
module.exports = {
    getAllComplaints,
    getStaffList,
    updateComplaint,
    raiseComplaint,
    getUserComplaints
};