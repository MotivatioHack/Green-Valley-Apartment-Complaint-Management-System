const db = require('../../config/db');

/**
 * Fetches all emergency contacts from the database.
 * Returns a list of contacts or an empty array if none exist.
 */
exports.getAllContacts = async (req, res) => {
    try {
        const [contacts] = await db.execute(
            `SELECT id, name, role, phone, email, availability FROM emergency_contacts ORDER BY name ASC`
        );

        return res.status(200).json(contacts || []);
    } catch (error) {
        console.error("❌ Emergency Contacts Controller Error:", error.message);
        return res.status(500).json({ 
            message: "Error fetching emergency contacts", 
            details: error.message 
        });
    }
};