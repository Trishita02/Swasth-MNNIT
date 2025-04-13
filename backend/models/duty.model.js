import mongoose from "mongoose";
import { Doctor } from "./doctor.js";

const DutySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,required: true,refPath: "role"},
  role: {type: String,required: true,enum: ["Doctor", "Staff"]},
  date: { type: Date, required: true },
  shift:{
    start_time: { type: String, required: true }, 
    end_time: { type: String, required: true },   
  },
  room: { type: String, required: true },
}, { timestamps: true });


DutySchema.post("save", async function (doc, next) {
    try {
      await Doctor.findByIdAndUpdate(doc.doctor, {
        $addToSet: { duties: doc._id }},
        { new: true }
      );
    } catch (error) {
      console.error("Error updating doctor's duties:", error);
    }
    next();
  });

// Update doctor's duties when duty is deleted
  DutySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
      await Doctor.findByIdAndUpdate(doc.doctor, {
        $pull: { duties: doc._id }},
        {new:true},
      );
    }
  });


// Prevent duplicate duties for same doctor at same time
DutySchema.index({ doctor: 1, date: 1, 'shift.start_time': 1 }, { unique: true });
export const Duty = mongoose.model("Duty", DutySchema);
