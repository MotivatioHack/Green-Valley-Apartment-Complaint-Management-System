const db = require('../../config/db');
const bcrypt = require('bcryptjs');

/**
 * FETCH ADMIN PROFILE
 * Gets details for the currently logged-in admin
 */
exports.getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id; 
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, department, role, created_at FROM users WHERE id = ? AND role = "ADMIN"',
            [adminId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin profile not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("❌ Get Admin Profile Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * UPDATE ADMIN PROFILE
 * Updates name, phone, and department
 */
exports.updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { name, phone, department } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        await db.execute(
            'UPDATE users SET name = ?, phone = ?, department = ? WHERE id = ? AND role = "ADMIN"',
            [name, phone || null, department || null, adminId]
        );

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("❌ Update Profile Error:", error.message);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

/**
 * UPDATE ADMIN PASSWORD
 */
exports.updateAdminPassword = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const [rows] = await db.execute('SELECT password FROM users WHERE id = ?', [adminId]);
        const user = rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedBtn = await bcrypt.hash(newPassword, salt);

        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedBtn, adminId]);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("❌ Password Update Error:", error.message);
        res.status(500).json({ message: "Failed to update password" });
    }
};