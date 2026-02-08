const mysql = require("mysql2");

// ✅ Create a promise-based MySQL pool (Railway public proxy compatible)
const pool = mysql.createPool({
  host: process.env.DB_HOST,                // e.g. ballast.proxy.rlwy.net
  port: Number(process.env.DB_PORT),        // e.g. 10973
  user: process.env.DB_USER,                // root
  password: process.env.DB_PASSWORD,        // Railway password
  database: process.env.DB_NAME,            // railway

  // 🔐 REQUIRED for Railway public connections
  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Validate DB connection on startup (fail fast)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Render will restart & show exact error
  }

  console.log("✅ MySQL Database Connected Successfully");
  connection.release();
});

// Export promise-based pool
module.exports = pool.promise();
