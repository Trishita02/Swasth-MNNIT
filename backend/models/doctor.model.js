import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getNextSequence } from "../utils/sequence.js"; 

const DoctorSchema = new mongoose.Schema({
  seqNo: { type: Number, unique: true },
  name: { type: String, required: true, trim: true }, // Added name
  username: { type: String, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String }, // Encrypted password
  specialization: { type: String, required: true},
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  duties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Duty" }],
},{timestamps:true});

// 🔐 Hash password before saving
DoctorSchema.pre("save", async function (next) {
  if (!this.seqNo) {
    this.seqNo = await getNextSequence("doctor"); // Get unique seqNo for doctors
  }
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

export const Doctor = mongoose.model("Doctor", DoctorSchema);
