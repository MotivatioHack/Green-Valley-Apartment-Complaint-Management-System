const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  }

  console.log("✅ MySQL Database Connected Successfully");
  connection.release();
});

module.exports = pool.promise();
