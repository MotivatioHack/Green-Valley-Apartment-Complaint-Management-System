const mysql = require("mysql2");

// ✅ Create a promise-based MySQL pool (Cloud-safe)
const pool = mysql.createPool({
  host: process.env.DB_HOST,          // REQUIRED
  port: process.env.DB_PORT || 3306,  // REQUIRED for cloud DBs
  user: process.env.DB_USER,          // REQUIRED
  password: process.env.DB_PASSWORD,  // REQUIRED
  database: process.env.DB_NAME,      // REQUIRED

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Validate DB connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Crash fast (Render will show real error)
  }
  console.log("✅ MySQL Database Connected Successfully");
  connection.release();
});

// Export promise-based pool
module.exports = pool.promise();
