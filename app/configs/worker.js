require("dotenv").config();
const Email = require("../models/send-email/email.models.js");
const connectDB = require("./database.js"); // Import kết nối MongoDB

// 🚀 Kết nối MongoDB trước khi chạy worker
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB.");
    console.log("🚀 Worker is running and listening for email jobs...");
  })
  .catch((err) => {
    console.error("❌ Worker failed to start due to MongoDB error:", err);
    process.exit(1); // Thoát nếu không thể kết nối MongoDB
  });
