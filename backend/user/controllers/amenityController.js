const db = require('../../config/db');

/**
 * Fetch all amenities
 */
exports.getAmenities = async (req, res) => {
    try {
        const [amenities] = await db.execute('SELECT * FROM amenities WHERE status != "closed"');
        res.status(200).json(amenities);
    } catch (error) {
        console.error("❌ Get Amenities Error:", error.message);
        res.status(500).json({ message: "Error fetching amenities" });
    }
};

/**
 * Create a new booking
 * Includes Feature #3: Downtime Check
 */
exports.createBooking = async (req, res) => {
    const { amenity_id, booking_date, time_slot } = req.body;
    const user_id = req.user.id;

    try {
        // 1. FEATURE #3: CHECK FOR ADMIN SCHEDULED DOWNTIME
        // Blocks booking if the date falls within a maintenance window
        const [downtime] = await db.execute(`
            SELECT reason FROM amenity_downtime 
            WHERE amenity_id = ? 
            AND ? BETWEEN start_datetime AND end_datetime
        `, [amenity_id, booking_date]);

        if (downtime.length > 0) {
            return res.status(400).json({ 
                message: `Facility is closed for ${downtime[0].reason}. Please select a different date.` 
            });
        }

        // 2. CHECK FOR DOUBLE BOOKING (CONFLICT)
        const [conflict] = await db.execute(`
            SELECT id FROM amenity_bookings 
            WHERE amenity_id = ? AND booking_date = ? AND time_slot = ? 
            AND status IN ('Pending', 'Approved')
        `, [amenity_id, booking_date, time_slot]);

        if (conflict.length > 0) {
            return res.status(400).json({ message: "This slot is already taken or pending approval." });
        }

        // 3. PROCEED WITH BOOKING
        await db.execute(`
            INSERT INTO amenity_bookings (amenity_id, user_id, booking_date, time_slot, status) 
            VALUES (?, ?, ?, ?, 'Pending')
        `, [amenity_id, user_id, booking_date, time_slot]);

        res.status(201).json({ message: "Booking request submitted successfully!" });

    } catch (error) {
        console.error("❌ Booking Error:", error.message);
        res.status(500).json({ message: "Failed to process booking" });
    }
};

/**
 * Get bookings for the logged-in user
 * Includes Feature #1 (Remarks) and Feature #2 (Auto-Expiry)
 */
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        // FEATURE #2: AUTO-EXPIRE PENDING BOOKINGS
        // Automatically mark bookings as 'Expired' if they are older than 24 hours
        await db.execute(`
            UPDATE amenity_bookings 
            SET status = 'Expired', admin_remark = 'System: Auto-expired (No action within 24hrs)'
            WHERE status = 'Pending' AND created_at < NOW() - INTERVAL 24 HOUR
        `);

        // Fetch bookings (Includes admin_remark for Feature #1)
        const [bookings] = await db.execute(`
            SELECT ab.*, a.name as amenity_name 
            FROM amenity_bookings ab 
            JOIN amenities a ON ab.amenity_id = a.id 
            WHERE ab.user_id = ? 
            ORDER BY ab.booking_date DESC`, 
            [userId]
        );
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Get User Bookings Error:", error.message);
        res.status(500).json({ message: "Error fetching your bookings" });
    }
};

/**
 * Admin: Update booking status (Approve/Reject)
 */
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_remark } = req.body;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        await db.execute(
            'UPDATE amenity_bookings SET status = ?, admin_remark = ? WHERE id = ?',
            [status, admin_remark, id]
        );

        res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully.` });
    } catch (error) {
        console.error("❌ Update Booking Error:", error.message);
        res.status(500).json({ message: "Error updating booking status" });
    }
};