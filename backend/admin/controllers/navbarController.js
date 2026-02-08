const db = require('../../config/db');

/**
 * FETCH NAV DATA
 * Returns admin profile info and real-time notification counts
 */
exports.getNavbarData = async (req, res) => {
    try {
        const adminId = req.user.id;

        // 1. Fetch Admin Profile info
        const [adminRows] = await db.execute(
            'SELECT name, role FROM users WHERE id = ? AND role = "ADMIN"',
            [adminId]
        );

        if (adminRows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 2. Fetch Notification Counts (Pending complaints & Pending amenity bookings)
        const [complaintCount] = await db.execute(
            'SELECT COUNT(*) as count FROM complaints WHERE status = "Pending"'
        );

        const [bookingCount] = await db.execute(
            'SELECT COUNT(*) as count FROM amenity_bookings WHERE status = "Pending"'
        );

        // 3. Fetch Recent Activity for Notification Panel
        const [recentActivity] = await db.execute(`
            (SELECT CONCAT('New Complaint: ', title) as message, created_at as time FROM complaints ORDER BY created_at DESC LIMIT 3)
            UNION ALL
            (SELECT CONCAT('New Booking Request for ', amenity_id) as message, created_at as time FROM amenity_bookings ORDER BY created_at DESC LIMIT 2)
            ORDER BY time DESC LIMIT 5
        `);

        res.status(200).json({
            profile: adminRows[0],
            notificationsCount: (complaintCount[0].count + bookingCount[0].count),
            recentActivity: recentActivity
        });
    } catch (error) {
        console.error("❌ Navbar Data Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};