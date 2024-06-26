const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true, // Convert email to lowercase before saving
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: { type: String, default: "admin" },
  status: {
    type: Boolean,
    default: true,
  },
});

// Hash password before saving to the database
AdminSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Create Admin model from schema
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
