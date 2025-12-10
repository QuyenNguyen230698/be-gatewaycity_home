const mongoose = require("mongoose");

const QuotePriceSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuotePrice", QuotePriceSchema);
