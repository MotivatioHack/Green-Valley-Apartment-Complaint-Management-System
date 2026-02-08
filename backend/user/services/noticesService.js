const db = require('../../config/db');

/**
 * Fetches all notices from the 'notices' table.
 * Logic: Pinned notices (1) come before unpinned (0).
 * Then, notices are ordered by date (newest first).
 */
exports.fetchAllNotices = async () => {
    try {
        const query = `
            SELECT 
                id, 
                title, 
                description, 
                type, 
                date, 
                pinned 
            FROM notices 
            ORDER BY pinned DESC, date DESC
        `;

        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error("Database Query Failed: " + error.message);
    }
};