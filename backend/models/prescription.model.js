import mongoose from "mongoose";
const { Schema } = mongoose;

const PrescriptionSchema = new Schema(
  {
    name: { type: String, required: true },
    reg_no: { type: String, required: true }, // Links to patient's reg_no
    date_of_visit: { type: Date, default: Date.now }, // Defaults to current date
    doctor_id: {type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,},
    diagnosis: { type: String, required: true },
    prev_issue: { type: String }, // Previous medical issue
    remark: { type: String }, // Additional doctor comments
    investigation: { type: String }, // Suggested tests or procedures
    medicines: [
  {
    name: { type: String, required: true },
    dosage: String,
    duration: String,
    instructions: String,
  }
] ,// List of medicines prescribed
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    }, // Reference to the Patient model
    advice: { type: String }, // Doctor's advice for the patient
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
