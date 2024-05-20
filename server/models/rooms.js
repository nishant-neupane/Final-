const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  id: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  isOccupied: { type: Boolean, default: false },
  
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
