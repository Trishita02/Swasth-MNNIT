const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  specialization: { type: String, required: true, trim: true }, // Example: "Cardiology"
  experience: { type: Number, required: true, min: 0 }, // Years of experience
  qualification: { type: String, required: true, trim: true }, // Example: "MBBS, MD"
  shift_timing: { type: String, required: true }, // Example: "Morning Shift"
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  availability: [
    {
      day: { type: String, required: true }, // Example: "Monday"
      start_time: { type: String, required: true }, // Example: "09:00"
      end_time: { type: String, required: true }, // Example: "15:00"
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
