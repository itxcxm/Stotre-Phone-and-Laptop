const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const errorHandler = require("./middlewares/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/", require("./routes/auth"));
app.use("/product", require("./routes/products"));
app.use("/carts", require("./routes/carts"));
app.use("/orders", require("./routes/orders"));

// Compatibility routes (for backward compatibility with frontend)
const Product = require("./models/Products");
const { authenticateToken, requireAdmin } = require("./middlewares/auth");

// Handle /add-product route (maps to POST /product)
app.post(
  "/add-product",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "Slug là bắt buộc!" });
      }
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        return res.status(400).json({ message: "Sản phẩm đã tồn tại!" });
      }
      const product = new Product(req.body);
      await product.save();
      res.status(200).json({ message: "Thêm sản phẩm thành công!", product });
    } catch (error) {
      next(error);
    }
  }
);

// Handle /update/:slug route (maps to GET /product/update/:slug)
app.get(
  "/update/:slug",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const product = await Product.findOne({ slug: req.params.slug });
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Handle PUT /update/:slug route
app.put(
  "/update/:slug",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await Product.updateOne(
        { slug: req.params.slug },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
      }
      res.json({ message: "Cập nhật sản phẩm thành công!", result });
    } catch (error) {
      next(error);
    }
  }
);

// Handle /ordersAdmin route (maps to GET /orders/admin)
app.get(
  "/ordersAdmin",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const Order = require("./models/Orders");
      const orders = await Order.find({});
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
