import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/treeDB");

const ItemSchema = new mongoose.Schema({
  index: String,
  children: [String],
  data: String,
  isFolder: Boolean,
  parent: String, 
});

const Item = mongoose.model("Item", ItemSchema);


console.log("Data inserted!");
process.exit();
