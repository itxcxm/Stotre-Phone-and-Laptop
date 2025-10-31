const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Product slug is required"],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    category: {
      name: {
        type: String,
        trim: true,
      },
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    specifications: {
      cpu: String,
      ram: String,
      storage: String,
      screen: String,
      gpu: String,
      battery: String,
      os: String,
      processor: String,
      camera: String,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price must be a positive number"],
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: "Discount price must be less than regular price",
      },
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["in_stock", "out_of_stock"],
        message: "Status must be either in_stock or out_of_stock",
      },
      default: "in_stock",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        path: {
          type: String,
          required: true,
        },
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ slug: 1 });
productSchema.index({ "category.name": 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });

// Auto-update status based on quantity
productSchema.pre("save", function (next) {
  if (this.quantity <= 0 && this.status === "in_stock") {
    this.status = "out_of_stock";
  } else if (this.quantity > 0 && this.status === "out_of_stock") {
    this.status = "in_stock";
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("products", productSchema);