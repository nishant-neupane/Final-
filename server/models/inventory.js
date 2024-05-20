const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    description: { type: String },
  },
  { versionKey: false }
);

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);
module.exports = InventoryItem;
