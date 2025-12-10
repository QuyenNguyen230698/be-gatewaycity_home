// routes/otp.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const axios = require('axios');
const OTP = require('../../models/send-email/otp.model');

// Hàm tạo OTP ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số
};

// API gửi OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Tạo OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    // Lưu OTP vào MongoDB
    await OTP.findOneAndUpdate(
      { phone },
      { phone, otp: hashedOTP, expiry },
      { upsert: true, new: true }
    );

    // Gửi OTP qua Zalo ZNS
    const response = await axios.post(
      'https://business.openapi.zalo.me/message/template',
      {
        phone,
        template_id: process.env.ZALO_TEMPLATE_ID,
        template_data: {
          otp_code: otp,
          expiry: '10 minutes',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          access_token: process.env.ZALO_ACCESS_TOKEN,
        },
      }
    );

    if (response.data.error !== 0) {
      return res.status(500).json({ error: 'Failed to send OTP via Zalo' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
  
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }
  
    try {
      // Tìm OTP trong MongoDB
      const otpRecord = await OTP.findOne({ phone });
  
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid phone number or OTP' });
      }
  
      // Kiểm tra OTP hết hạn
      if (Date.now() > otpRecord.expiry) {
        await OTP.deleteOne({ phone });
        return res.status(400).json({ error: 'OTP has expired' });
      }
  
      // So sánh OTP
      const isMatch = await bcrypt.compare(otp, otpRecord.otp);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
  
      // Xóa OTP sau khi xác thực thành công
      await OTP.deleteOne({ phone });
  
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;