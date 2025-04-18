//
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BatchSchema = new Schema({
  batch_no: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  b_quantity: {
    type: Number,
    required: true,
  },
  invoice_date: {
    type: Date,
    required: true,
  },
  invoice_no: {
    type: String,
    required: true,
  },
});

const MedicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Ointment",
    "Drops",
    "Cream",
    "Gel",
    "Powder",
    "Inhaler",
    "Lotion",
    "Spray",
    "Suppository",
    "Patch",
    "Solution",
    "Suspension",
    "Granules",
    "Lozenge",
    "Nasal Spray",
    "Ear Drops",
    "Eye Ointment"
    ],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,  // Assuming unit is a string, like "strips"
    required: true,
  },
  expiry: {
    type: Date,  // Storing expiry as a Date type for better handling of dates
    required: true,
  },
  batches: [BatchSchema],  // Keeping the batches schema as is
  supplier: {
    type: String,
    required: true,
  },
});



const Medicine = mongoose.model("Medicine", MedicineSchema);
export default Medicine;
