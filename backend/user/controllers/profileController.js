const db = require('../../config/db');

/**
 * Fetch profile of the logged-in user
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From verifyToken middleware

        const [rows] = await db.execute(
            'SELECT id, name, email, flat_number, tower_number, role, status, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("❌ Get Profile Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update profile of the logged-in user
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, flat_number, tower_number } = req.body;

        // Validation: Ensure basic fields are provided
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const [result] = await db.execute(
            'UPDATE users SET name = ?, flat_number = ?, tower_number = ? WHERE id = ?',
            [name, flat_number, tower_number, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Update failed, user not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("❌ Update Profile Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * Fetch profile fields specifically for TopNavbar
 */
exports.getNavbarProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(
            'SELECT name, flat_number, tower_number FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("❌ Navbar Profile Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ... existing getProfile and updateProfile methods ...