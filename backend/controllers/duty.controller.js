import { Duty } from "../models/duty.model.js";
import { Doctor } from "../models/doctor.model.js";
import  Staff  from "../models/staff.model.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import mongoose from "mongoose";


export const addDuty = async (req, res) => {
    try {
      const { userId, role, date, shift, room } = req.body;
      // Validation checks
      if (!userId || !role || !date || !shift || !room) {
        throw new ApiError(400, "All fields are required");
      }

      if (!["Doctor", "Staff"].includes(role)) {
        throw new ApiError(400, "Invalid role specified");
      }

      if (!shift.start_time || !shift.end_time) {
        throw new ApiError(400, "Shift must have start_time and end_time");
      }

      // Convert time strings to minutes for easier comparison
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const startMinutes = timeToMinutes(shift.start_time);
      const endMinutes = timeToMinutes(shift.end_time);
      const isOvernight = endMinutes <= startMinutes;

      // Helper function to check time overlaps
      const isOverlap = (start1, end1, start2, end2) => {
        // Convert overnight shifts into two intervals for comparison
        const normalize = (start, end) => {
          return end >= start
            ? [[start, end]] // same day
            : [[start, 1440], [0, end]]; // overnight split into two intervals
        };

        const intervals1 = normalize(start1, end1);
        const intervals2 = normalize(start2, end2);

        return intervals1.some(([s1, e1]) =>
          intervals2.some(([s2, e2]) => s1 < e2 && e1 > s2)
        );
      };

      // Validate user exists
      const userExists = role === "Doctor"
        ? await Doctor.findById(userId)
        : await Staff.findById(userId);

      if (!userExists) {
        throw new ApiError(404, `${role} not found`);
      }

      const dutyDate = new Date(date);
      const utcDate = new Date(Date.UTC(
        dutyDate.getUTCFullYear(),
        dutyDate.getUTCMonth(),
        dutyDate.getUTCDate()
      ));

      // Check for existing duty for the user
      const userDuties = await Duty.find({ user: userId, date: utcDate });
      for (const duty of userDuties) {
        const dStart = timeToMinutes(duty.shift.start_time);
        const dEnd = timeToMinutes(duty.shift.end_time);
        if (isOverlap(startMinutes, endMinutes, dStart, dEnd)) {
          throw new ApiError(409,
            `${role} already has a duty from ${duty.shift.start_time} to ${duty.shift.end_time}`
          );
        }
      }

      // Check for room conflict
      const dutiesInRoom = await Duty.find({ room, date: utcDate });
      for (const duty of dutiesInRoom) {
        const dStart = timeToMinutes(duty.shift.start_time);
        const dEnd = timeToMinutes(duty.shift.end_time);
        if (isOverlap(startMinutes, endMinutes, dStart, dEnd)) {
          throw new ApiError(409,
            `Room ${room} is already booked from ${duty.shift.start_time} to ${duty.shift.end_time}`
          );
        }
      }

      // Create the duty with additional time metadata
      const duty = await Duty.create({
        user: userId,
        role,
        date: utcDate,
        shift: {
          start_time: shift.start_time,
          end_time: shift.end_time,
          start_minutes: startMinutes,
          end_minutes: endMinutes,
          is_overnight: isOvernight
        },
        room
      });

      const populatedDuty = await Duty.findById(duty._id)
        .populate("user", "name email specialization")
        .lean();

      return res.status(201).json(
        new ApiResponse(201, populatedDuty, "Duty assigned successfully")
      );
    } catch (error) {
      return res.status(error.statusCode || 500).json(
        new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")
      );
    }
  };


export const deleteDuty =async (req, res) => {
    const { dutyId } = req.params;
    // Validate dutyId
    if (!mongoose.Types.ObjectId.isValid(dutyId)) {
      throw new ApiError(400, "Invalid duty ID");
    }
  
    // Find and delete the duty
    const duty = await Duty.findByIdAndDelete(dutyId);
    if (!duty) {
      throw new ApiError(404, "Duty not found");
    }
  
    // Remove the duty reference from the corresponding staff/doctor
    if (duty.role === "Doctor") {
      await Doctor.findByIdAndUpdate(
        duty.user,
        { $pull: { duties: dutyId } },
        { new: true }
      );
    } else {
      await Staff.findByIdAndUpdate(
        duty.user,
        { $pull: { duties: dutyId } },
        { new: true }
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Duty deleted successfully"));
  };
  

  export const viewAllDuties = async (req, res) => {
    try {
      const duties = await Duty.find()
        .populate("user") // populates full user object
        .lean();
  
      const formattedDuties = duties.map((duty) => ({
        id: duty._id,
        user_id: duty.user,
        name: duty.user?.name || "Unknown",
        role: duty.role,
        specialization: duty.user?.specialization || "N/A",
        room: duty.room,
        date: new Date(duty.date).toISOString().split("T")[0], // YYYY-MM-DD
        start_time: duty.shift.start_time,
        end_time: duty.shift.end_time,
      }));
  
      res.status(200).json({
        success: true,
        message: "All duties fetched successfully",
        data: formattedDuties,
      });
    } catch (error) {
      console.error("Error fetching duties:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch duties",
        error: error.message,
      });
    }
  };

// Get all doctors (optionally filtered by specialization)
export const getAllDoctors = async (req, res) => {
  try {
    const query = {};

    if (req.query.specialization) {
      query.specialization = {
        $regex: new RegExp(`^${req.query.specialization}$`, "i"),
      };
    }

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all staff
export const getAllStaffs = async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




  