const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductsSchema = new mongoose.Schema(
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
    features: { type: Array },
    images: { type: Array },
    blueprint: { type: Array },
    floor1: { type: Object },
    floor2: { type: Object },
    floor3: { type: Object },
    floor4: { type: Object },
  },
  { timestamps: true }
);

ProductsSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Product", ProductsSchema);