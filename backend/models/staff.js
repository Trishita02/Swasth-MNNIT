import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Encrypted password
  salary: { type: Number, required: true, min: 0 },
  shifts: [
    {
      date: { type: Date, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

// 🔐 Hash password before saving
StaffSchema.pre("save", async function (next) {
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
