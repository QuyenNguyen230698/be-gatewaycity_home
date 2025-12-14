const {quotepriceServices} = require("../../services/system/quoteprice.service.js");
const QuotePrice = require('../../models/system/quoteprice.model.js');
const Email = require("../../models/send-email/email.models.js");
const sendEmail = require("../../configs/mailer.js");

const quotepriceController = {
    getQuotePrice: async (req, res) => {
        try {
          const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;
    
          const { quotepriceDataList, totalRecords } = await quotepriceServices.getQuotePrice(skip, take, where, search, sorted, requiresCounts);
    
          res.status(200).json({
            result: quotepriceDataList,
            count: totalRecords,
          });
        } catch (error) {
          console.error('Error fetching movie data:', error);
          res.status(500).json({ message: 'Error fetching movie data', error: error.message });
        }
      },
    createQuotePrice: async (req, res) => {
        try {
          const { firstName, lastName, phoneNumber, email, note, urlRegist } = req.body;

          // ===== 1. Validate =====
          if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "Missing quote price fields" });
          }

          // ===== 2. Lưu vào DB =====
          const newQuotePrice = new QuotePrice({
            firstName,
            lastName,
            phoneNumber,
            email,
            note,
          });
          await newQuotePrice.save();

          // Dữ liệu gửi tới template email
          const name = `${firstName} ${lastName}`;
          const path = "thanks/index.ejs"; // file template bạn tự đặt

          // ===== 3. Email gửi tới Admin =====
          const recipients = [
            "traile.bi@gmail.com",
            "gatewaycityvinhlong@gmail.com"
          ];

          let emailRecords = [];

          for (const recipient of recipients) {

            // ---- Lưu log email ----
            const newEmail = new Email({
              to: recipients,
              subject: "GatewayCity Homes Notification",
              templateData: { name, email, phoneNumber, note, urlRegist, path },
              status: "pending",
              isOpen: false,
            });

            const savedEmail = await newEmail.save();
            emailRecords.push(savedEmail);

            // ---- Tracking Pixel ----
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

            // ---- Gửi email ----
            await sendEmail(
              recipient,
              "Gateway City Homes – New Quote Request",
              templateData
            );

            // ---- Update trạng thái ----
            await Email.findByIdAndUpdate(savedEmail._id, {
              status: "sent",
            });
          }

          // ===== 4. Trả về response =====
          res.status(200).json({
            message: "Quote price created & emails sent successfully",
            quote: newQuotePrice,
            emails: emailRecords.map((e) => ({ id: e._id, to: e.to })),
          });

        } catch (error) {
          console.error("❌ Error creating quote price:", error);
          res.status(500).json({
            message: "Error creating quote price",
            error: error.message,
          });
        }
      },
}

module.exports = { quotepriceController };
