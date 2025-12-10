// mailer.js
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email với template EJS
 * @param {string|string[]} to
 * @param {string} subject
 * @param {object} data - data cho template EJS
 */
const sendEmail = async (to, subject, data) => {
  try {
    const templatePath = path.join(__dirname, `../views/${data.path}`);
    const htmlContent = await ejs.renderFile(templatePath, data);

    // pixel tracking
    const trackingPixel = `<img src="${data.trackingUrl}" width="1" height="1" style="display:none;" />`;
    const finalHtml = htmlContent + trackingPixel;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: finalHtml,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}`, error);
    throw error;
  }
};

module.exports = sendEmail;
