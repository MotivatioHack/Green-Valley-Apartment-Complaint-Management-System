const mysql = require("mysql2");

// ✅ Use Railway MYSQL_PUBLIC_URL directly (recommended & safest)
const pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL);

// ✅ Validate DB connection on startup (fail fast)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Render will restart and show the exact error
  }

  console.log("✅ MySQL Database Connected Successfully");
  connection.release();
});

// Export promise-based pool
module.exports = pool.promise();
