const db = require('../../config/db');

// 1. FETCH ALL BOOKINGS (Includes Auto-Expiry logic)
const getAllAmenityBookings = async (req, res) => {
    try {
        // Auto-expire bookings older than 24 hours
        await db.execute(`
            UPDATE amenity_bookings 
            SET status = 'Expired', admin_remark = 'System: Auto-expired (No action within 24hrs)'
            WHERE status = 'Pending' AND created_at < NOW() - INTERVAL 24 HOUR
        `);

        const query = `
            SELECT 
                b.id, b.booking_date as date, b.time_slot as timeSlot, 
                b.status, b.admin_remark as remark, b.created_at as createdAt,
                a.name as amenityName, u.name as residentName, u.flat_number as flatNo
            FROM amenity_bookings b
            JOIN amenities a ON b.amenity_id = a.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        `;
        const [rows] = await db.execute(query);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ Admin GetAllBookings Error:", error.message);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

// 2. UPDATE BOOKING STATUS (With Remark Support)
const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status, remark } = req.body;

    try {
        const query = 'UPDATE amenity_bookings SET status = ?, admin_remark = ? WHERE id = ?';
        await db.execute(query, [status, remark || null, id]);
        res.status(200).json({ message: `Booking ${status} successfully` });
    } catch (error) {
        console.error("❌ Admin UpdateBookingStatus Error:", error.message);
        res.status(500).json({ message: "Database update failed" });
    }
};

// 3. AMENITY DOWNTIME SCHEDULER (The Missing Function)
const setAmenityDowntime = async (req, res) => {
    const { amenity_id, start_datetime, end_datetime, reason } = req.body;

    try {
        const query = `
            INSERT INTO amenity_downtime 
            (amenity_id, start_datetime, end_datetime, reason) 
            VALUES (?, ?, ?, ?)
        `;
        
        await db.execute(query, [amenity_id, start_datetime, end_datetime, reason]);

        res.status(201).json({ message: "Downtime scheduled successfully" });
    } catch (error) {
        console.error("❌ Downtime Error:", error.message);
        res.status(500).json({ message: "Failed to schedule downtime in database" });
    }
};

// EXPORT ALL THREE FUNCTIONS
module.exports = { 
    getAllAmenityBookings, 
    updateBookingStatus, 
    setAmenityDowntime 
};