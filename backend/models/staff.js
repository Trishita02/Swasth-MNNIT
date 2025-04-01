const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Nurse", "Receptionist", "Pharmacist", "Cleaner", "Other"],
    required: true,
  },
  salary: { type: Number, required: true, min: 0 },
  shift_timing: { type: String, required: true }, // Example: "Night Shift"
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  shifts: [
    {
      date: { type: Date, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const Staff = mongoose.model("Staff", StaffSchema);
module.exports = Staff;
