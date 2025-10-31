const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Thiếu token xác thực, hãy thử lại!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Token đã hết hạn, vui lòng đăng nhập lại!" });
        } else {
          return res.status(403).json({ message: "Token không hợp lệ" });
        }
      }

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res
          .status(403)
          .json({ message: "Người dùng không tồn tại hoặc đã bị vô hiệu hóa" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
