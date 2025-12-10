
const mongoose = require("mongoose");
const slugify = require("slugify"); // Thêm dòng này để import slugify

const searchSchema = new mongoose.Schema(
  {
    _idRef: { type: String },
    name: { type: String },
    child: { type: String },
    description: { type: String },
    slug: { type: String },
    status: {
      type: String,
      default: "published",
      enum: ["draft", "published"],
    },
  },
  { timestamps: true }
);
// Create a text index on the name and description fields
searchSchema.index({ name: "text", description: "text", child: "text", slug: "text" });

const search = mongoose.model("search", searchSchema);

module.exports = search;
