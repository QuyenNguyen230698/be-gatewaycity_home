const mongoose = require("mongoose");
const slugify = require("slugify");

const NewsAndEventsSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      sparse: true,
    },
    title: { type: String },
    description: { type: String },
    src: { type: String },
    content: { type: Object },
    type: { type: String, default: "NEWS", enum: ["NEWS", "EVENTS"] },
    status: { type: String, default: "published", enum: ['published', 'drafted', 'archived'] }
  },
  { timestamps: true }
);

NewsAndEventsSchema.pre("save", async function (next) {
  if (this.isModified("title") && this.title) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: false,                    // cho phép dấu gạch ngang, underscore
      remove: /[*+~.()'"!:@,]/g,        // loại bỏ ký tự đặc biệt
    });

    let slug = baseSlug;
    let count = 1;

    // Kiểm tra slug đã tồn tại chưa
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("NewsAndEvents", NewsAndEventsSchema);