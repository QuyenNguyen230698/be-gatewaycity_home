const express = require("express");
const axios = require("axios");
const geoip = require("geoip-lite");
const router = express.Router();
const emailQueue = require("../../configs/redis.js");
const Email = require("../../models/send-email/email.models.js");
const sendEmail = require("../../configs/mailer.js");

// ✅ Route hiển thị trang "Thanks"
router.get("/thanks", (req, res) => {
  res.render("thanks/index");
});

// ✅ API gửi email (thêm vào queue)
router.post("/send-email", async (req, res) => {
  try {
    const { name, email, phoneNumber, note, urlRegist, path } = req.body;

    if (!name || !email || !path) {
      return res.status(400).json({ error: "Missing email parameters" });
    }

    // Danh sách người nhận cố định
    const recipients = [
      "traile.bi@gmail.com",
      "daumy848@gmail.com"
    ];

    let emailRecords = [];

    for (const recipient of recipients) {
      // 1. Lưu database
      const newEmail = new Email({
        to: recipients,
        subject: "GatewayCity Homes Notification",
        templateData: { name, email, phoneNumber, note, urlRegist, path },
        status: "pending",
        isOpen: false,
      });

      const savedEmail = await newEmail.save();
      emailRecords.push(savedEmail);

      // 2. Tracking URL
      const trackingUrl = `http://localhost:4000/api/email/track-email/${savedEmail._id}`;

      const templateData = {
        name,
        email,
        phoneNumber,
        note,
        urlRegist,
        path,
        trackingUrl,
      };

      // 3. Gửi email trực tiếp
      await sendEmail(recipient, "Gateway City Homes", templateData);

      // 4. Cập nhật trạng thái là "sent"
      await Email.findByIdAndUpdate(savedEmail._id, {
        status: "sent",
      });
    }

    res.json({
      message: "Emails sent successfully!",
      emails: emailRecords.map((e) => ({ id: e._id, to: e.to })),
    });
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


// ✅ API theo dõi trạng thái mở email + tracking IP + vị trí địa lý
router.get("/track-email/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    // 📌 Lấy địa chỉ IP của người mở email
    let userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (userIp.includes("::ffff:")) {
      userIp = userIp.replace("::ffff:", ""); // Chuyển IPv6-mapped IPv4 về IPv4
    }

    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).send("Email not found");
    }

    // 📌 Lấy vị trí địa lý từ IP bằng geoip-lite
    const geo = geoip.lookup(userIp);
    const locationData = geo
      ? {
          country: geo.country || null, // Mã quốc gia (VN, US,...)
          region: geo.region || null, // Mã vùng (VD: 44 - Hồ Chí Minh)
          city: geo.city || null, // Thành phố
          lat: geo.ll ? geo.ll[0] : null, // Vĩ độ
          lon: geo.ll ? geo.ll[1] : null, // Kinh độ
          timezone: geo.timezone || null, // Múi giờ
        }
      : {};

    // 📌 Cập nhật trạng thái đã mở email + lưu IP & vị trí địa lý
    email.isOpen = true;
    email.openedAt = new Date();
    email.openedIp = userIp;
    email.location = locationData;
    await email.save();

    console.log(`📩 Email ${emailId} opened from IP: ${userIp}, Location: ${JSON.stringify(locationData)}`);

    // 📌 Trả về ảnh tracking pixel 1x1
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88xAAAIMAIHSZADYAAAAASUVORK5CYII=",
      "base64"
    );
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(pixel);
  } catch (error) {
    console.error("❌ Error tracking email:", error);
    res.status(500).send("Internal server error");
  }
});

// ✅ API kiểm tra trạng thái email
router.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
