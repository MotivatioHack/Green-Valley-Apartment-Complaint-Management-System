// MUST BE THE VERY FIRST LINE
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Database
const db = require("./config/db");

// ==============================
// 1. Import User Routes
// ==============================
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./user/routes/dashboardRoutes");
const complaintRoutes = require("./user/routes/complaintRoutes");
const noticesRoutes = require("./user/routes/noticesRoutes");
const emergencyContactsRoutes = require("./user/routes/emergencyContactsRoutes");
const profileRoutes = require("./user/routes/profileRoutes");
const amenityRoutes = require("./user/routes/amenityRoutes");

// ==============================
// 2. Import Admin Routes
// ==============================
const adminDashboardRoutes = require("./admin/routes/dashboardRoutes");
const adminComplaintRoutes = require("./admin/routes/complaintRoutes");
const adminResidentRoutes = require("./admin/routes/residentRoutes");
const adminStaffRoutes = require("./admin/routes/staffRoutes");
const adminNoticeRoutes = require("./admin/routes/noticesRoutes");
const adminReportRoutes = require("./admin/routes/reportRoutes");
const adminEmergencyRoutes = require("./admin/routes/emergencyRoutes");
const adminAmenityRoutes = require("./admin/routes/amenityRoutes");
const adminAmenityBookingRoutes = require("./admin/routes/amenityBookingRoutes");
const adminProfileRoutes = require("./admin/routes/profileRoutes");
const adminNavbarRoutes = require("./admin/routes/navbarRoutes");

// ==============================
// 3. Contact / SMS Route
// ==============================
const contactRoutes = require("./routes/contactRoutes");

// ==============================
// 4. Initialize App
// ==============================
const app = express();

// ==============================
// 5. Middleware
// ==============================
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// ==============================
// 6. Database Connection Check
// ==============================
db.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Database Connected Successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  });

// ==============================
// 7. Routes Registration
// ==============================

// ---- User Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/user/dashboard", dashboardRoutes);
app.use("/api/notices", noticesRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/emergency-contacts", emergencyContactsRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/amenities", amenityRoutes);

// ---- Admin Routes ----
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);
app.use("/api/admin/residents", adminResidentRoutes);
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/notices", adminNoticeRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/emergency-contacts", adminEmergencyRoutes);
app.use("/api/admin/amenities", adminAmenityRoutes);
app.use("/api/admin/amenity-bookings", adminAmenityBookingRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/admin/navbar", adminNavbarRoutes);

// ---- Contact / SMS ----
app.use("/api/contact", contactRoutes);

// ==============================
// 8. Health Check
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Green Valley API is running...");
});

// ==============================
// 9. Start Server
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log("📡 Logging enabled. Watching for API requests...");
});
