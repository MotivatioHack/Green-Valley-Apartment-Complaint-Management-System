const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("❌ Auth Error: No Bearer Token found in headers");
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: verified.id || verified.userId || verified.sub,
            role: verified.role,
            email: verified.email
        };

        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        const message = error.name === 'TokenExpiredError' ? "Token Expired" : "Invalid Token";
        return res.status(403).json({ message });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: "Access Denied. Admin Role Required." });
    }
};

module.exports = { 
    verifyToken,
    protect: verifyToken, 
    admin 
};