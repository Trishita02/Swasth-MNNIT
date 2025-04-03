import mongoose from "mongoose";
const { Schema } = mongoose;

const PatientSchema = new Schema({
  name: { type: String, required: true },
  reg_no: { type: String, required: true, unique: true }, // Unique registration number
  last_visit: { type: Date, default: Date.now }, // Defaults to current date if not provided
  issue: { type: String, required: true }, // Health issue description
  type: { type: String, enum: ["student", "faculty"], required: true }, // Specifies patient type
});

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;
