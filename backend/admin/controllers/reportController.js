const pool = require('../../config/db');

/**
 * 1. GET SYSTEM REPORTS
 * Simplified queries to match confirming schema columns only.
 */
const getSystemReports = async (req, res) => {
    try {
        // Fetch Live Stats
        const [complaintStats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress
            FROM complaints
        `);

        // Fetch Category Distribution
        const [categoryData] = await pool.query(`
            SELECT 
                category as name, 
                COUNT(*) as count,
                ROUND((COUNT(*) * 100 / (SELECT COUNT(*) FROM complaints)), 0) as percentage
            FROM complaints
            GROUP BY category
        `);

        // Fetch Monthly Trends (Last 6 Months)
        const [monthlyTrend] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as month,
                COUNT(*) as complaints,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
            FROM complaints
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month, MONTH(created_at)
            ORDER BY MONTH(created_at)
        `);

        // Fetch Detailed Export Data (Removed 'updated_at' reference)
        const [exportData] = await pool.query(`
            SELECT 
                c.id, c.title, c.category, c.status, c.created_at,
                u.name as resident, s.name as staff, c.admin_remark
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN staff s ON c.staff_id = s.id
            ORDER BY c.created_at DESC
        `);

        res.status(200).json({
            stats: complaintStats[0] || { total: 0, resolved: 0, pending: 0, inProgress: 0 },
            categoryData: categoryData || [],
            monthlyTrend: monthlyTrend || [],
            exportData: exportData || []
        });

    } catch (error) {
        console.error("❌ Admin Reports Error:", error.message);
        res.status(500).json({ message: "Database query failed for reports" });
    }
};

module.exports = { getSystemReports };