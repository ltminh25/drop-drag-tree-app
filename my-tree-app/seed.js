import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/treeDB");

const ItemSchema = new mongoose.Schema({
  index: String,
  isFolder: Boolean,
  children: [String],
  data: String
});

const Item = mongoose.model("Item", ItemSchema);

await Item.insertMany([
  { index: "root", isFolder: true, children: ["Meals", "Fruit", "Drinks"], data: "All Categories" },
  { index: "Meals", isFolder: true, children: ["Dog", "Pig", "Chicken"], data: "Meals" },
  { index: "Dog", isFolder: false, children: [], data: "Chó" },
  { index: "Pig", isFolder: false, children: [], data: "Lợn" },
  { index: "Chicken", isFolder: false, children: [], data: "Gà" },
  { index: "Fruit", isFolder: true, children: ["Strawberry", "Watermelon"], data: "Fruit" },
  { index: "Strawberry", isFolder: false, children: [], data: "Dâu tây" },
  { index: "Watermelon", isFolder: false, children: [], data: "Dưa hấu" },
  { index: "Drinks", isFolder: true, children: ["Cola", "Pepsi"], data: "Drinks" },
  { index: "Cola", isFolder: false, children: [], data: "Cola" },
  { index: "Pepsi", isFolder: true, children: ["Pepsi1"], data: "Pepsi" },
  { index: "Pepsi1", isFolder: false, children: [], data: "Pepsi1" }
]);

console.log("Data inserted!");
process.exit();
