import mongoose from "mongoose";
const { Schema } = mongoose;

const PatientSchema = new Schema({
  name: { type: String, required: true },
  reg_no: { type: String, required: true, unique: true }, // Unique registration number
  issue: { type: String, required: true }, // Health issue description
  type: { type: String, enum: ["Student", "Faculty"], required: true }, // Specifies patient type
  age: {type: Number, required: true}, // Age of the patient
  gender: { type: String, required: true, enum: ["Female", "Male"]},
  address: { type: String, required: true }, // Address of the patient
  blood_group: { type: String, required: true }, // Blood group of the patient
  dob: { type: Date, required: true }, // Date of birth of the patient
  email: { type: String, required: true }, // Email address of the patient

  last_visit: { type: Date, default: Date.now }, // Defaults to current date if not provided
  allergies: { type: String, default: "None" }, // Allergies of the patient
});

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;
