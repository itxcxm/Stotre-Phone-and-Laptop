const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middlewares/auth");

// Đăng ký
router.post("/signup", async (req, res, next) => {
  try {
    const { userName, password, fullName, email, phone } = req.body;

    if (!userName || !password || !fullName || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      password: hashedPassword,
      fullName,
      email,
      phone,
      isActive: true,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res
      .status(201)
      .json({ accessToken, refreshToken, fullName: newUser.fullName });
  } catch (error) {
    next(error);
  }
});

// Đăng nhập
router.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Sai tên đăng nhập!" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Tài khoản đã bị vô hiệu hóa!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Sai mật khẩu!" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "Không có Refresh Token!" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Refresh Token không hợp lệ!" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh Token hết hạn!" });
      }

      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
});

// Lấy thông tin người dùng
router.get("/user-info", authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
