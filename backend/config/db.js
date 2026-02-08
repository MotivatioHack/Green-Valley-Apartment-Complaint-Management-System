const mysql = require("mysql2");

// Create a connection pool to manage multiple connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  // Port 10973 for Railway external; defaults to 3306 if env is missing
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  // Ensure this is set as DB_PASSWORD in your Render Environment variables
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  
  // MANDATORY for connecting from Render to Railway
  ssl: {
    rejectUnauthorized: false,
  },
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // Prevents the app from hanging if the DB is unreachable
  connectTimeout: 10000 
});

// Test the connection immediately on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed!");
    console.error("Error Code:", err.code); // e.g., 'ER_ACCESS_DENIED_ERROR'
    console.error("Error Message:", err.message);
    
    // Debugging info (helps identify if variables are missing)
    console.error("Connecting as:", process.env.DB_USER || "MISSING_USER");
    console.error("To Host:", process.env.DB_HOST || "MISSING_HOST");
    
    // In Render, exiting with 1 tells the platform the service crashed 
    // so it can attempt a clean restart.
    process.exit(1);
  }

  if (connection) {
    console.log("✅ MySQL Database Connected Successfully to Railway!");
    connection.release();
  }
});

// Export the promise-based version for async/await usage in routes
module.exports = pool.promise();