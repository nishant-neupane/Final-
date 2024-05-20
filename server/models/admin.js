const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    dateOfBirth: Date,
    isAdmin: { type: Boolean, default: false },
    profilePicture: String 
  },
  { versionKey: false }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
