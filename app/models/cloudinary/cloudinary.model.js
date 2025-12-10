const mongoose = require("mongoose");

const CloudinarySchema = new mongoose.Schema(
  {
    public_id: { type: String, unique: true },
    signature: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    resource_type: { type: String, required: true },
    bytes: { type: Number, required: true },
    secure_url: { type: String, required: true },
    display_name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cloudinary", CloudinarySchema);
