const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

WorkerSchema.pre("save", async function (next) {
  const worker = this;
  if (!worker.isModified("password")) return next();

  const hash = await bcrypt.hash(worker.password, 10);
  worker.password = hash;
  next();
});

const Worker = mongoose.model("Worker", WorkerSchema);

module.exports = Worker;
