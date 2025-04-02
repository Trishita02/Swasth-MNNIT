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
  M_name: {
    type: String,
    required: true,
  },
  batches: [BatchSchema],
  brand_name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "tablet",
      "capsule",
      "injection",
      "syrup",
      "suspension",
      "gel",
      "gargle",
      "syringe",
      "",
      "powder",
      "drop",
      "miscellaneous",
    ],
    default: "tablet",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export const Medicine = mongoose.model("Medicine", MedicineSchema);
