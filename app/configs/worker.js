require("dotenv").config();
const sendEmail = require("./mailer");
const emailQueue = require("./redis");
const Email = require("../models/send-email/email.models");
const connectDB = require("./database"); // Import kết nối MongoDB

// 🚀 Kết nối MongoDB trước khi chạy worker
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB.");
    console.log("🚀 Worker is running and listening for email jobs...");

    // Xử lý email queue
    emailQueue.process(5, async (job, done) => {
      try {
        const { emailId, to, subject, templateData } = job.data;

        console.log(`📩 Processing email job: ${emailId} | To: ${to} | Subject: ${subject}`);

        // Gửi email
        await sendEmail(to, subject, templateData);

        // Cập nhật trạng thái trong MongoDB
        await Email.findByIdAndUpdate(emailId, { status: "sent" });

        console.log(`✅ Email sent successfully: ${emailId} | To: ${to}`);
        done();
      } catch (error) {
        console.error(`❌ Failed to send email to ${job.data.to}:`, error);

        // Cập nhật trạng thái email thất bại
        await Email.findByIdAndUpdate(job.data.emailId, { status: "failed" });

        done(error);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Worker failed to start due to MongoDB error:", err);
    process.exit(1); // Thoát nếu không thể kết nối MongoDB
  });
