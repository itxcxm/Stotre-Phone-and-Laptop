const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// Lấy tất cả sản phẩm
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Lấy sản phẩm theo slug
router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Thêm sản phẩm (chỉ admin)
router.post("/", authenticateToken, requireAdmin, async (req, res, next) => {
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
    res.status(201).json({ message: "Thêm sản phẩm thành công!", product });
  } catch (error) {
    next(error);
  }
});

// Cập nhật sản phẩm (chỉ admin)
router.put(
  "/:slug",
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

// Xóa sản phẩm (chỉ admin)
router.delete(
  "/:slug",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await Product.deleteOne({ slug: req.params.slug });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
      }
      res.json({ message: "Xóa sản phẩm thành công!" });
    } catch (error) {
      next(error);
    }
  }
);

// Lấy sản phẩm để cập nhật (chỉ admin)
router.get(
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

module.exports = router;
