const mysql = require("mysql2");

// Use a connection pool for better performance in a deployed environment
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Railway requires SSL for external connections
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Shorten the timeout so the app fails/restarts faster if the DB is down
  connectTimeout: 10000 
});

// Immediate connection test
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed!");
    console.error("Error Message:", err.message);
    console.error("Target Host:", process.env.DB_HOST);
    // Don't kill the process immediately in development, 
    // but in production (Render), this helps trigger a redeploy/fix.
    process.exit(1);
  }

  if (connection) {
    console.log("✅ MySQL Database Connected Successfully to Railway");
    connection.release();
  }
});

module.exports = pool.promise();