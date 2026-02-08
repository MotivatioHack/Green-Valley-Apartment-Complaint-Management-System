const pool = require('../../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Fetch counts for StatCards
        const [totalComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints');
        const [pending] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "Pending"');
        const [resolved] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "Resolved"');
        const [residents] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "USER"');
        const [staff] = await pool.query('SELECT COUNT(*) as count FROM staff');
        const [notices] = await pool.query('SELECT COUNT(*) as count FROM notices');

        // 2. Fetch category distribution for Chart
        const [categories] = await pool.query(`
            SELECT category as name, COUNT(*) as count 
            FROM complaints 
            GROUP BY category
        `);

        // 3. Fetch priority distribution
        const [priorities] = await pool.query(`
            SELECT priority, COUNT(*) as count 
            FROM complaints 
            GROUP BY priority
        `);

        // 4. Fetch 5 most recent complaints with resident flat numbers
        const [recentComplaints] = await pool.query(`
            SELECT c.id, c.title, c.priority, c.status, u.flat_number as flatNo 
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
            LIMIT 5
        `);

        res.status(200).json({
            stats: {
                totalComplaints: totalComplaints[0].count || 0,
                pendingComplaints: pending[0].count || 0,
                resolvedComplaints: resolved[0].count || 0,
                totalResidents: residents[0].count || 0,
                totalStaff: staff[0].count || 0,
                activeNotices: notices[0].count || 0
            },
            categories: categories || [],
            priorities: priorities || [],
            recentComplaints: recentComplaints || []
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({ 
            message: "Error fetching dashboard data", 
            error: error.message 
        });
    }
};

module.exports = {
    getDashboardStats
};