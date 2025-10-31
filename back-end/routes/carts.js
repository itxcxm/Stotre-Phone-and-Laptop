const express = require("express");
const router = express.Router();
const Cart = require("../models/Carts");
const Product = require("../models/Products");
const { authenticateToken } = require("../middlewares/auth");

// Thêm sản phẩm vào giỏ hàng
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { slug } = req.body;
    const userId = req.user.id;

    if (!slug) {
      return res.status(400).json({ message: "Slug sản phẩm là bắt buộc!" });
    }

    const existingCart = await Cart.findOne({ slug, user: userId });
    if (existingCart) {
      return res
        .status(400)
        .json({ message: "Sản phẩm đã tồn tại trong giỏ hàng!" });
    }

    const newCart = new Cart({ slug, user: userId });
    await newCart.save();
    res.status(200).json({ message: "Thêm vào giỏ hàng thành công!" });
  } catch (error) {
    next(error);
  }
});

// Lấy giỏ hàng của người dùng
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ user: userId });
    const slugs = cartItems.map((item) => item.slug);
    const products = await Product.find({ slug: { $in: slugs } });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:slug", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug sản phẩm là bắt buộc!" });
    }

    const result = await Cart.deleteOne({
      slug: slug,
      user: userId,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng!" });
    }

    res.json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
