const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Encrypted password
  specialization: { type: String, required: true, trim: true }, // Example: "Cardiology"
  experience: { type: Number, required: true, min: 0 }, // Years of experience
  qualification: { type: String, required: true, trim: true }, // Example: "MBBS, MD"
  availability: [
    {
      day: { type: String, required: true }, // Example: "Monday"
      start_time: { type: String, required: true }, // Example: "09:00"
      end_time: { type: String, required: true }, // Example: "15:00"
    },
  ],
  created_at: { type: Date, default: Date.now },
});

// 🔐 Hash password before saving
DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Check if password is correct
DoctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 Generate JWT Access Token
DoctorSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
