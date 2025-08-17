import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Route test (check xem admin route hoạt động chưa)
router.get("/ping", (req, res) => {
  res.json({ message: "✅ Admin route is working" });
});

// Route xoá toàn bộ database
router.delete("/clear-database", async (req, res) => {
  try {
    await mongoose.connection.dropDatabase();
    res.json({ message: "Đã xoá toàn bộ database" });
  } catch (err) {
    console.error("❌ Lỗi khi xoá DB:", err);
    res.status(500).json({ error: "Lỗi khi xoá database", details: err.message });
  }
});

export default router;
