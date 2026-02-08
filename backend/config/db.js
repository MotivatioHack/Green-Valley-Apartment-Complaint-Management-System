const mysql = require('mysql2');

// ✅ Create a promise-based pool directly
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'society_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool directly with promise support
module.exports = pool.promise();