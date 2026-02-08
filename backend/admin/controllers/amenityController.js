const pool = require('../../config/db');

// 1. FETCH ALL AMENITIES
const getAllAmenities = async (req, res) => {
    try {
        const query = 'SELECT id, name, description, icon_name, status, created_at FROM amenities ORDER BY created_at DESC';
        const [rows] = await pool.query(query);
        res.status(200).json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("❌ SQL Error in getAllAmenities:", error.message);
        res.status(500).json([]);
    }
};

// 2. ADD NEW AMENITY
const addAmenity = async (req, res) => {
    const { name, description, icon_name } = req.body;
    try {
        const query = `
            INSERT INTO amenities (name, description, icon_name, status) 
            VALUES (?, ?, ?, 'available')
        `;
        const [result] = await pool.query(query, [name, description, icon_name || 'Building']);
        res.status(201).json({ id: result.insertId, message: "Amenity created successfully" });
    } catch (error) {
        console.error("❌ SQL Error in addAmenity:", error.message);
        res.status(500).json({ message: "Failed to add amenity" });
    }
};
// 3. UPDATE AMENITY
const updateAmenity = async (req, res) => {
    const { id } = req.params;
    const { name, description, icon_name, status } = req.body;
    try {
        const query = `
            UPDATE amenities 
            SET name = ?, description = ?, icon_name = ?, status = ? 
            WHERE id = ?
        `;
        await pool.query(query, [name, description, icon_name, status, id]);
        res.status(200).json({ message: "Amenity updated successfully" });
    } catch (error) {
        console.error("❌ SQL Error in updateAmenity:", error.message);
        res.status(500).json({ message: "Update failed" });
    }
};
// 4. TOGGLE AMENITY STATUS (Soft Delete/Disable)
const toggleAmenityStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT status FROM amenities WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Amenity not found" });

        const newStatus = rows[0].status === 'available' ? 'closed' : 'available';
        await pool.query('UPDATE amenities SET status = ? WHERE id = ?', [newStatus, id]);
        res.status(200).json({ status: newStatus });
    } catch (error) {
        res.status(500).json({ message: "Toggle failed" });
    }
};

// 5. FETCH ALL BOOKINGS
const getAllBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.*, a.name as amenityName, u.name as residentName, u.flat_no as flatNo 
            FROM amenity_bookings b
            JOIN amenities a ON b.amenity_id = a.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.booking_date DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

// 6. UPDATE BOOKING STATUS (Approve/Reject)
const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE amenity_bookings SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: `Booking ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Status update failed" });
    }
};
const deleteAmenity = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM amenities WHERE id = ?', [id]);
        res.status(200).json({ message: "Amenity deleted" });
    } catch (error) {
        console.error("❌ SQL Error in deleteAmenity:", error.message);
        res.status(500).json({ message: "Delete failed" });
    }
};
module.exports = { 
    getAllAmenities, addAmenity, updateAmenity, 
    toggleAmenityStatus, getAllBookings, deleteAmenity ,updateBookingStatus 
};