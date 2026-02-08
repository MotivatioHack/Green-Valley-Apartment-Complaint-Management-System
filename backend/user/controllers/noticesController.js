const noticesService = require('../services/noticesService');

/**
 * Retrieves all notices from the database.
 * Orders them by pinned status first, then by date (latest first).
 */
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await noticesService.fetchAllNotices();
        
        // Return empty array if no notices found to prevent frontend crash
        return res.status(200).json(notices || []);
    } catch (error) {
        console.error("❌ Error in getAllNotices Controller:", error.message);
        return res.status(500).json({ 
            message: "Failed to fetch notices", 
            details: error.message 
        });
    }
};