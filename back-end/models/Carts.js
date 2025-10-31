const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "User ID is required"],
      ref: "user",
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      ref: "products",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate cart items
cartsSchema.index({ user: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("carts", cartsSchema);