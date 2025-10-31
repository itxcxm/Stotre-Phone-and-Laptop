const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    idUser: {
      type: String,
      required: [true, "User ID is required"],
      ref: "user",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    images: String,
    products: {
      slug: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message: "Status must be pending, processing, shipped, delivered, or cancelled",
      },
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: { values: ["pending", "paid"], message: "Payment status must be pending or paid" },
      default: "pending",
    },
    notes: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ordersSchema.index({ idUser: 1 });
ordersSchema.index({ orderNumber: 1 });
ordersSchema.index({ status: 1 });

module.exports = mongoose.model("orders", ordersSchema);