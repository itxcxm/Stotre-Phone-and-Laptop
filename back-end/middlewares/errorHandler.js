const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Dữ liệu đã tồn tại" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Lỗi server!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
