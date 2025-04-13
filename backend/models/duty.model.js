import mongoose from "mongoose";
import { Doctor } from "./doctor.js";
import { Staff } from "./staff.js";

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
    if (doc.role === "Doctor") {
      await Doctor.findByIdAndUpdate(doc.user, {
        $addToSet: { duties: doc._id }
      });
    } else if (doc.role === "Staff") {
      await Staff.findByIdAndUpdate(doc.user, {
        $addToSet: { duties: doc._id }
      });
    }
  } catch (error) {
    console.error("Error updating user's duties:", error);
  }
  next();
});

// Remove duty from user's duties array on delete
DutySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      if (doc.role === "Doctor") {
        await Doctor.findByIdAndUpdate(doc.user, {
          $pull: { duties: doc._id }
        });
      } else if (doc.role === "Staff") {
        await Staff.findByIdAndUpdate(doc.user, {
          $pull: { duties: doc._id }
        });
      }
    } catch (error) {
      console.error("Error removing duty from user's duties:", error);
    }
  }
});
export const Duty = mongoose.model("Duty", DutySchema);
