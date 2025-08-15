import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());

async function startServer() {
  try {
    await mongoose.connect("mongodb://localhost:27017/treeDB");
    console.log("✅ MongoDB connected");

    app.get("/api/tree", async (req, res) => {
      const items = await Item.find();
      const dbData = {};
      items.forEach(item => {
        dbData[item.index] = {
          index: item.index,
          isFolder: item.isFolder,
          children: item.children,
          data: item.data
        };
      });
      res.json(dbData);
    });

    app.listen(4000, () => {
      console.log("🚀 Server running on port 4000");
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

const ItemSchema = new mongoose.Schema({
  index: String,
  isFolder: Boolean,
  children: [String],
  data: String
});

const Item = mongoose.model("Item", ItemSchema);

startServer();