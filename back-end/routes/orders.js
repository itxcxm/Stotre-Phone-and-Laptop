const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// Tạo đơn hàng
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      idUser: req.user.id,
    };
    const newOrder = new Order(orderData);
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Thêm đơn hàng thành công!", order: newOrder });
  } catch (error) {
    next(error);
  }
});

// Lấy đơn hàng của người dùng
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const orders = await Order.find({ idUser: req.user.id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Lấy tất cả đơn hàng (chỉ admin)
router.get(
  "/admin",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const orders = await Order.find({});
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

// Xóa đơn hàng
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại!" });
    }

    // Chỉ cho phép xóa đơn hàng của chính mình hoặc admin
    if (order.idUser !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa đơn hàng này!" });
    }

    const result = await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Xóa đơn hàng thành công!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
