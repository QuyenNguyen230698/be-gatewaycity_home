const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  to: { type: Array, required: true },
  subject: { type: String, required: true },
  text: { type: String },
  status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  isOpen: { type: Boolean, default: false },
  openedIp: { type: String },
  openedAt: { type: Date }, // Thời gian mở email
  location: {
    country: { type: String },
    city: { type: String },
    lat: { type: Number },
    lon: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
