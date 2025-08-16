import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import xlsx from "xlsx";

const app = express();
app.use(cors());

// Multer config
const upload = multer({ dest: "uploads/" });

// Mongo schema
const ItemSchema = new mongoose.Schema({
  index: String,
  isFolder: Boolean,
  children: [String],
  data: String,
});
const Item = mongoose.model("Item", ItemSchema);

await mongoose.connect("mongodb://localhost:27017/treeDB");
console.log("✅ MongoDB connected");

// API lấy tree
app.get("/api/tree", async (req, res) => {
  const items = await Item.find();
  const dbData = {};
  items.forEach((item) => {
    dbData[item.index] = {
      index: item.index,
      isFolder: item.isFolder,
      children: item.children,
      data: item.data,
    };
  });
  res.json(dbData);
});

// API upload excel
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheet) {
      await Item.create({
        index: row.index,
        isFolder: row.isFolder === "TRUE" || row.isFolder === true,
        children: row.children ? row.children.split(",") : [],
        data: row.data,
      });
    }

    res.json({ success: true, message: "Excel uploaded & inserted to DB" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Server running on port 4000");
});
