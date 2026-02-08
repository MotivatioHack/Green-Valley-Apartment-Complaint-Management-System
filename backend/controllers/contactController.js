const twilio = require('twilio');

// Initialize Twilio client using exactly the variable names in your .env
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Sends an SMS notification to the developer when the Contact form is submitted.
 * Path: POST /api/contact/send-sms
 */
exports.sendContactSMS = async (req, res) => {
    console.log("🚀 API HIT: Received data:", req.body);
    try {
        const { name, flatNumber, message } = req.body;

        // 1. Validation: Ensure all fields are present
        if (!name || !flatNumber || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide your name, flat number, and message." 
            });
        }

        // 2. Sanitize Inputs
        const cleanName = name.trim();
        const cleanFlat = flatNumber.trim();
        const cleanMessage = message.trim();

        // 3. Construct the SMS Payload
        // We use a simple, clean format to ensure it fits within standard SMS character limits
        const timestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'short',
            timeStyle: 'short'
        });
        
        const smsBody = `📩 Green Valley Portal\n` +
                        `From: ${cleanName}\n` +
                        `Flat: ${cleanFlat}\n` +
                        `Time: ${timestamp}\n` +
                        `Msg: ${cleanMessage}`;

        // 4. Dispatch SMS
        // Note: Using DEVELOPER_PHONE_NUMBER to match your updated .env
        const messageResponse = await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.DEVELOPER_PHONE_NUMBER
        });

        // 5. Console Log for Debugging
        console.log(`[SMS Success] SID: ${messageResponse.sid} sent to ${process.env.DEVELOPER_PHONE_NUMBER}`);

        return res.status(200).json({ 
            success: true, 
            message: "Your message has been delivered to the developer's phone." 
        });

    } catch (error) {
        // Detailed logging for the developer to identify Twilio-specific issues
        console.error("--- Twilio SMS Failure ---");
        console.error("Error Code:", error.code); // Twilio error code (e.g., 21608 for unverified numbers)
        console.error("Message:", error.message);
        
        // Return a professional error message to the frontend
        return res.status(500).json({ 
            success: false, 
            message: "The SMS service is currently unavailable. Please try again later." 
        });
    }
};