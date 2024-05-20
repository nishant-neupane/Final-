const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    id: String,
    customerName: String,
    customerEmail: String,
    roomType: String,
    roomNumber: String,
    checkInDate: Date,
    checkOutDate: Date,
    adults: Number,
    children: Number,
    paymentToken: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
