import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Counter name (e.g., "doctor_seq", "staff_seq")
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

/**
 * Get the next sequence number for a given model.
 * @param {string} modelName - "doctor" or "staff"
 */
export async function getNextSequence(modelName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: `${modelName}_seq` }, // Unique counter per model
    { $inc: { seq: 1 } }, // Increment seq by 1
    { new: true, upsert: true } // Create if not exists
  );
  return counter.seq;
}
