const db = require('../../config/db');

exports.getUserOverview = async (req, res) => {
    const userId = req.user.id;

    try {
        const [userProfile] = await db.execute(
            `SELECT name, flat_number as flat_no, tower_number FROM users WHERE id = ?`,
            [userId]
        );

        const [stats] = await db.execute(
            `SELECT 
                COUNT(*) as total,
                COALESCE(SUM(CASE WHEN UPPER(status) = 'RESOLVED' THEN 1 ELSE 0 END), 0) as resolved,
                COALESCE(SUM(CASE WHEN UPPER(status) = 'PENDING' THEN 1 ELSE 0 END), 0) as pending,
                COALESCE(SUM(CASE WHEN UPPER(status) = 'IN PROGRESS' THEN 1 ELSE 0 END), 0) as in_progress
            FROM complaints 
            WHERE user_id = ?`,
            [userId]
        );

        const [recent] = await db.execute(
            `SELECT id, title, category, status, created_at 
             FROM complaints 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        const [notices] = await db.execute(
            `SELECT id, title, description, type, date 
             FROM notices 
             ORDER BY date DESC 
             LIMIT 3`
        );

        return res.status(200).json({
            user: userProfile[0] || { name: "Resident", flat_no: "N/A" },
            summary: {
                totalComplaints: parseInt(stats[0].total) || 0,
                resolvedComplaints: parseInt(stats[0].resolved) || 0,
                pendingComplaints: parseInt(stats[0].pending) || 0,
                in_progress: parseInt(stats[0].in_progress) || 0
            },
            recentComplaints: recent || [],
            upcomingNotices: notices || []
        });

    } catch (error) {
        console.error("❌ DASHBOARD ERROR:", error.message);
        return res.status(500).json({ message: "Error fetching data" });
    }
};