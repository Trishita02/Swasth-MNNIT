import mongoose from "mongoose";
const { Schema } = mongoose;

const PrescriptionSchema = new Schema(
  {
    patient_name: { type: String, required: true },
    reg_no: { type: String, required: true }, // Links to patient's reg_no
    date_of_visit: { type: Date, default: Date.now }, // Defaults to current date
    doctor_name: { type: String, required: true },
    diagnosis: { type: String, required: true },
    prev_issue: { type: String }, // Previous medical issue
    remark: { type: String }, // Additional doctor comments
    investigation: { type: String }, // Suggested tests or procedures
    medicines: [{ type: String, required: true }], // List of medicines prescribed
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
