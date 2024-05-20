const express = require("express");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const employeeModel = require("./models/employee");
const Admin = require("./models/admin");
const Booking = require("./models/booking");
const InventoryItem = require("./models/inventory");
const Room = require("./models/rooms");
const WorkerModel = require("./models/worker");

const bodyParser = require("body-parser");
require("dotenv").config();
const { sendMail } = require("./Component/Nodemailaer");
const crypto = require("crypto");
const hash = crypto.createHash("sha256");
const axios = require("axios");
const request = require("request");
var cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/employee")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// MongoDB session store
const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/employee",
  collection: "sessions",
});

// Session middleware
app.use(
  session({
    secret: "N!$#@NT123",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

app.post("/sendfeedback", async (req, res) => {
  const { feedback } = req.body;

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      subject: "Feedback",
      text: feedback,
    });

    res.status(200).send("Feedback sent successfully!");
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).send("Failed to send feedback. Please try again later.");
  }
});

app.post("/send-feedback", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendMail({
      to: process.env.MAIL_TO,
      subject: "Contact",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res
      .status(500)
      .json({ error: "Failed to send feedback. Please try again later." });
  }
});

app.post("/send-booking-email", async (req, res) => {
  const {
    bill,
    fullName,
    email,
    phone,
    checkInDate,
    checkOutDate,
    totalAmount,
  } = req.body;

  const bookingDetails = `
      -------------------------------------------
               Hotel Shivansh
        Phone: +977 023-452478
        Location: Bhadrapur, Nepal

  -------------------------------------------
  Bill no: ${bill}
  Name: ${fullName}
  Email: ${email}
  Phone Number: ${phone}
  
  Check-in Date: ${checkInDate}
  Check-out Date: ${checkOutDate}
  
  Total Amount: RS ${totalAmount}
  
  -------------------------------------------
        Booking Successful! Thank you!
    `;

  try {
    await sendMail({
      to: email,
      subject: "Booking Confirmation",
      text: bookingDetails,
    });

    res.status(200).json({ message: "Booking email sent successfully" });
  } catch (error) {
    console.error("Error sending booking email:", error);
    res.status(500).json({ error: "Failed to send booking email" });
  }
});

// Room routes
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error while fetching rooms:", error);
    res.status(500).json({ error: "An error occurred while fetching rooms" });
  }
});
//ROOMS

// Available rooms
app.get("/available-rooms", async (req, res) => {
  try {
    const roomType = req.query.roomType;
    const availableRooms = await Room.find({
      type: roomType,
      available: true,
      isOccupied: false,
    });
    res.json(availableRooms);
  } catch (error) {
    console.error("Error while fetching rooms:", error);
    res.status(500).json({ error: "An error occurred while fetching rooms" });
  }
});

//Add Room
app.post("/rooms", async (req, res) => {
  const { roomNumber, type, description, price } = req.body;

  try {
    const highestRoom = await Room.findOne({}, {}, { sort: { id: -1 } });

    let newId = 1;

    if (highestRoom) {
      newId = highestRoom.id + 1;
    }

    const newRoom = await Room.create({
      id: newId,
      roomNumber,
      type,
      description,
      price,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error during room creation:", error);
    res.status(500).json({ error: "An error occurred while creating room" });
  }
});
//delete room
app.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoom = await Room.findOneAndDelete({ id });

    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error during room deletion:", error);
    res.status(500).json({ error: "An error occurred while deleting room" });
  }
});
//Update room
app.put("/rooms/:_id", async (req, res) => {
  const { name, type, description, price } = req.body;
  const { _id } = req.params;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      _id,
      {
        name,
        type,
        description,
        price,
      },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "An error occurred while updating room" });
  }
});

// Get room details by ID
app.get("/room/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findOne({ id });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("Error while fetching room details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching room details" });
  }
});

// Employee routes
// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const employee = await WorkerModel.find();
    res.json(employee);
  } catch (error) {
    console.error("Error while fetching emplloyee:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching employee" });
  }
});

// Get wWrker

app.get("/Workers", async (req, res) => {
  try {
    const Worker = await WorkerModel.find();
    res.json(Worker);
  } catch (error) {
    console.error("Error while fetching Workers:", error);
    res.status(500).json({ error: "An error occurred while fetching Workers" });
  }
});

// Add or edit employee
app.post("/workers", async (req, res) => {
  const { id, name, jobTitle, email, password } = req.body;
  if (!name || !jobTitle || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, jobTitle, email, and password are required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  try {
    let newUser;
    if (id) {
      const existingUser = await WorkerModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: "Worker not found" });
      }
      existingUser.name = name;
      existingUser.jobTitle = jobTitle;
      existingUser.email = email;
      existingUser.password = await bcrypt.hash(password, 10);
      newUser = await existingUser.save();
    } else {
      const existingUser = await WorkerModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hash = await bcrypt.hash(password, 10);
      newUser = await WorkerModel.create({
        name,
        jobTitle,
        email,
        password: hash,
      });
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error while adding/editing Worker:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding/editing Worker" });
  }
});

// Delete employee
app.delete("/Workers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await WorkerModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "Worker not found" });
    }
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    console.error("Error while deleting Worker:", error);
    res.status(500).json({ error: "An error occurred while deleting Worker" });
  }
});

// Booking routes
// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error while fetching bookings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching bookings" });
  }
});

// Add Booking
app.post("/bookings", async (req, res) => {
  const {
    id,
    customerName,
    customerEmail,
    roomType,
    checkInDate,
    checkOutDate,
    adults,
    children,
    roomNumber,
  } = req.body;

  try {
    // // Find the highest existing ID
    // const highestBooking = await Booking.findOne({}, {}, { sort: { id: -1 } });
    // let newId = 1;

    // // If there are existing bookings, increment the ID
    // if (highestBooking) {
    //   newId = highestBooking.id + 1;
    // }

    // Create the booking with the generated ID
    const newBooking = await Booking.create({
      id: id,
      customerName,
      customerEmail,
      roomType,
      checkInDate,
      checkOutDate,
      adults,
      children,
      roomNumber, // Add roomNumber here
    });
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error during booking creation:", error);
    res.status(500).json({ error: "An error occurred while creating booking" });
  }
});

// Delete a booking
app.delete("/bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findOneAndDelete({ id });

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error during booking deletion:", error);
    res.status(500).json({ error: "An error occurred while deleting booking" });
  }
});
// Update a booking
app.put("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    customerEmail,
    roomType,
    checkInDate,
    checkOutDate,
    adults,
    children,
    roomNumber,
  } = req.body;

  try {
    let bookingToUpdate = await Booking.findOne({ id });

    if (!bookingToUpdate) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking fields
    bookingToUpdate.customerName = customerName;
    bookingToUpdate.customerEmail = customerEmail;
    bookingToUpdate.roomType = roomType;
    bookingToUpdate.checkInDate = checkInDate;
    bookingToUpdate.checkOutDate = checkOutDate;
    bookingToUpdate.adults = adults;
    bookingToUpdate.children = children;
    bookingToUpdate.roomNumber = roomNumber;

    await bookingToUpdate.save();

    res.json({
      message: "Booking updated successfully",
      booking: bookingToUpdate,
    });
  } catch (error) {
    console.error("Error during booking update:", error);
    res.status(500).json({ error: "An error occurred while updating booking" });
  }
});

// Update room
app.patch("/room/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const { available, isOccupied, roomNumber } = req.body;
  try {
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).send("Room not found");
    }

    if (available !== undefined) {
      room.available = available;
    }
    if (isOccupied !== undefined) {
      room.isOccupied = isOccupied;
    }
    if (roomNumber !== undefined) {
      room.roomNumber = roomNumber;
    }

    await room.save();
    res.status(200).send("Room status updated successfully");
  } catch (error) {
    console.error("Error occurred while updating room status:", error);
    res.status(500).send("An error occurred while updating room status");
  }
});

// Inventory routes

// Get all assets
app.get("/assets", async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (error) {
    console.error("Error while fetching assets:", error);
    res.status(500).json({ error: "An error occurred while fetching assets" });
  }
});

// Add a new asset
app.post("/assets", async (req, res) => {
  const { name, category, quantity, description } = req.body;

  try {
    const newInventoryItem = await InventoryItem.create({
      name,
      category,
      quantity,
      description,
    });
    res.status(201).json(newInventoryItem);
  } catch (error) {
    console.error("Error during asset creation:", error);
    res.status(500).json({ error: "An error occurred while creating asset" });
  }
});
// Update an asset
app.put("/assets/:id", async (req, res) => {
  const { name, category, quantity, description } = req.body;
  const { id } = req.params;

  try {
    const updatedInventoryItem = await InventoryItem.findByIdAndUpdate(
      id,
      {
        name,
        category,
        quantity,
        description,
      },
      { new: true }
    );

    if (!updatedInventoryItem) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json(updatedInventoryItem);
  } catch (error) {
    console.error("Error during asset update:", error);
    res.status(500).json({ error: "An error occurred while updating asset" });
  }
});
// Delete an  asset
app.delete("/assets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInventoryItem = await InventoryItem.findByIdAndDelete(id);

    if (!deletedInventoryItem) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error during asset deletion:", error);
    res.status(500).json({ error: "An error occurred while deleting asset" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await employeeModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No Record Existed" });
    }
    // const checkPassword = await bcrypt.compare(password, user.password);

    // if (!checkPassword) {
    //   return res
    //     .status(400)
    //     .json({ msg: "Error: Incorrect email or password !" });
    // }

    // Compare passwords
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while logging in" });
      }
      if (result) {
        // Regenerate session
        req.session.regenerate((err) => {
          if (err) {
            console.error("Error regenerating session:", err);
            return res
              .status(500)
              .json({ error: "An error occurred while logging in" });
          }
          // Set user session data
          req.session.user = user;
          // req.session.expiresAt = Date.now() + (10 * 1000);
          res.json({
            user: {
              name: user.name,
              email: user.email,
            },
          });
        });
      } else {
        res.status(401).json("Invalid password");
      }
    });
  } catch (error) {
    console.error("Error while finding user:", error);
    res.status(500).json({ error: "An error occurred while finding user" });
  }
});
const otpMap = new Map();
// Function to generate a random OTP
function generateOTP() {
  const otpLength = 6;
  const characters = "0123456789";
  let otp = "";
  // Loop to generate OTP
  for (let i = 0; i < otpLength; i++) {
    otp += characters[Math.floor(Math.random() * characters.length)];
  }
  return otp;
}

app.post("/sendotp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const subject = "Signup OTP";

  try {
    await sendMail({
      to: email,
      subject,
      text: `Your OTP for signup is ${otp}`,
    });
    otpMap.set(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ error: "Failed to send OTP. Please try again later." });
  }
});
app.post("/verifyotp", (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpMap.get(email);

  if (storedOTP === otp) {
    otpMap.delete(email);
    res.redirect("http://localhost:5173/home");
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// Signup route

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  // Check if email is a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await employeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password and create the user
    const hash = await bcrypt.hash(password, 10);
    const newUser = await employeeModel.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error during user creation:", error);
    res.status(500).json({ error: "An error occurred while creating user" });
  }
});

// Admin login route
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, isAdmin: true });

    if (admin) {
      const result = await bcrypt.compare(password, admin.password);

      if (result) {
        const adminData = {
          email: admin.email,
          name: admin.name,
          address: admin.address,
          dateOfBirth: admin.dateOfBirth,
          profilePicture: admin.profilePicture,
          isAdmin: admin.isAdmin,
        };
        res.json({ success: true, admin: adminData });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    } else {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
  } catch (error) {
    console.error("Error while finding admin:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while finding admin",
    });
  }
});

// Admin signup route
app.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  // Check if email is a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Check if the email is already registered
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Hash the password and create the admin
  const hash = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({
    name,
    email,
    password: hash,
    isAdmin: true,
  });

  res.status(201).json(newAdmin);
});

// Edit user
app.get("/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUser = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    await Admin.findOneAndUpdate({ email }, updatedUser);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Verify and reset password route
app.put("/admin/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash the new password
    const hash = await bcrypt.hash(newPassword, 10);
    // Update the user's password with the new hashed password
    existingUser.password = hash;
    await existingUser.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
});

// Send verification code route
app.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await employeeModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    const otp = generateOTP();
    otpMap.set(email, otp);

    // Send the verification code via email
    await sendMail({
      to: email,
      subject: "Forgot Password Verification Code",
      text: `Your verification code is ${otp}`,
    });

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({
      error: "Failed to send verification code. Please try again later.",
    });
  }
});

app.post("/send-admin-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    const otp = generateOTP();
    otpMap.set(email, otp);

    // Send the verification code via email
    await sendMail({
      to: email,
      subject: "Forgot Password Verification Code For Admin",
      text: `Your verification code is ${otp}`,
    });

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({
      error: "Failed to send verification code. Please try again later.",
    });
  }
});

// Verify and reset password route
app.post("/verify-reset-password", async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  const storedOTP = otpMap.get(email);

  if (storedOTP !== verificationCode) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  try {
    const existingUser = await employeeModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    existingUser.password = hash;
    await existingUser.save();

    otpMap.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
});
app.post("/verify-reset-admin-password", async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  const storedOTP = otpMap.get(email);

  if (storedOTP !== verificationCode) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  try {
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    existingUser.password = hash;
    await existingUser.save();

    otpMap.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
});

// Change password route
app.put("/admin/change-password/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // Configuring Multer for disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// // Handling the POST request to upload a file
// app.post(
//   "/admins/upload-profile-picture",
//   upload.single("image"),
//   (req, res) => {
//     if (
//       req.file &&
//       (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png")
//     ) {
//       res.status(200).json({
//         success: true,
//         message: "File uploaded successfully",
//         url: `http://localhost:3001/uploads/${req.file.filename}`,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Only JPG and PNG files are accepted",
//       });
//     }
//   }
// );

// // Handling GET requests to retrieve uploaded files
// app.get("/uploads/:filename", async (req, res) => {
//   try {
//     const fileName = req.params.filename;
//     const file = await fs.readFile(path.join(__dirname, "uploads", fileName));
//     res.status(200).send(file);
//   } catch (error) {
//     res.status(404).json({ error: "File not found" });
//   }
// });

// automatically delete the booking of token false after 10 sec

cron.schedule("*/1000 * * * * *", async () => {
  try {
    await Booking.deleteMany({ paymentToken: false });
  } catch (error) {
    console.error("Error occurred while deleting expired records:", error);
  }
});
cron.schedule("0 * * * *", async () => {
  try {
    await Booking.deleteMany({ checkOutDate: { $lt: new Date() } });
    console.log("Expired bookings deleted successfully");
  } catch (error) {
    console.error("Error occurred while deleting expired bookings:", error);
  }
});

app.post("/khalti/initiate-payment", (req, res) => {
  const { formData, totalAmount } = req.body;

  const options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/initiate/",
    headers: {
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: "http://localhost:3001/payment/callback",
      website_url: "http://localhost:5173/",
      amount: totalAmount * 100,
      purchase_order_id: formData.id,
      purchase_order_name: "Room Booking",
      customer_info: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
    }),
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error("Error while initiating Khalti payment:", error);
      res.status(500).json({ error: "Failed to initiate payment" });
      return;
    }

    res.status(response.statusCode).send(body);
  });
});

app.get("/payment/callback", async (req, res) => {
  try {
    const { status, transaction_id, purchase_order_id } = req.query;

    if (status === "Completed") {
      const roomId = purchase_order_id;

      const booking = await Booking.findOneAndUpdate(
        { id: roomId },
        { paymentToken: true },
        { new: true }
      );

      if (booking) {
        await Room.findByIdAndUpdate(
          roomId,
          { available: false, isOccupied: true },
          { new: true }
        );
        res.send(
          `<script>alert("Payment successful and receipt sent to your email");
          window.location.href = 'http://localhost:5173';</script>`
        );
      } else {
        res.status(500).send(
          `<script>alert("Failed to update booking with payment token.");
            window.location.href = 'http://localhost:5173';</script>`
        );
      }
    } else {
      res
        .status(400)
        .send(
          `<script>alert("Payment failed or in pending state. Booking not made."); setTimeout(function() { window.location.href = 'http://localhost:5173'; }, 2000);</script>`
        );
    }
  } catch (error) {
    console.error("Error occurred while processing payment callback:", error);
    res
      .status(500)
      .send("Internal server error occurred while processing payment.");
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
