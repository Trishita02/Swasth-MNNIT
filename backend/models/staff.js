import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getNextSequence } from "../utils/sequence.js";

const StaffSchema = new mongoose.Schema({
  seqNo: { type: Number, unique: true },
  name: { type: String, required: true, trim: true }, // Added name
  username: { type: String, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String}, // Encrypted password
  created_at: { type: Date, default: Date.now },
});

// 🔐 Hash password before saving
StaffSchema.pre("save", async function (next) {
  if (!this.seqNo) {
    this.seqNo = await getNextSequence("staff"); // Get unique seqNo for staff
  }
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Check if password is correct
StaffSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 Generate JWT Access Token
StaffSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const Staff = mongoose.model("Staff", StaffSchema);
