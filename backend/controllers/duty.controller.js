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
  
      const userExists =
        role === "Doctor"
          ? await Doctor.findById(userId)
          : await Staff.findById(userId);
  
      if (!userExists) {
        throw new ApiError(404, `${role} not found`);
      }
  
      const existingDuty = await Duty.findOne({
        user: userId,
        date: new Date(date),
        "shift.start_time": shift.start_time
      });
  
      if (existingDuty) {
        throw new ApiError(409, `${role} already has a duty scheduled at this time`);
      }
  
      const roomConflict = await Duty.findOne({
        date: new Date(date),
        room,
        $or: [
          {
            "shift.start_time": { $lt: shift.end_time },
            "shift.end_time": { $gt: shift.start_time }
          }
        ]
      });
  
      if (roomConflict) {
        throw new ApiError(
          409,
          `Room ${room} is already booked from ${roomConflict.shift.start_time} to ${roomConflict.shift.end_time}`
        );
      }
  
      const duty = await Duty.create({
        user: userId,
        role,
        date: new Date(date),
        shift: {
          start_time: shift.start_time,
          end_time: shift.end_time
        },
        room
      });
  
      const populatedDuty = await Duty.findById(duty._id)
      .populate("user") 
      .lean();
    
  
      return res
        .status(201)
        .json(new ApiResponse(201, populatedDuty, "Duty assigned successfully"));
    } catch (error) {
      // This sends any thrown error as JSON response
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
  };

  
  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
  };
  export const updateDuty = async (req, res) => {
    try {
      const { dutyId } = req.params;
      const { userId, date, shift, room } = req.body;
  
      // Validate duty ID
      if (!mongoose.Types.ObjectId.isValid(dutyId)) {
        throw new ApiError(400, "Invalid duty ID format");
      }
  
      // Find existing duty
      const existingDuty = await Duty.findById(dutyId);
      if (!existingDuty) {
        throw new ApiError(404, "Duty not found");
      }
  
      const updates = {};
      const checks = {
        date: existingDuty.date,
        room: existingDuty.room,
        user: existingDuty.user,
        shift: existingDuty.shift
      };
  
      // Validate and update user
      if (userId !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new ApiError(400, "Invalid user ID format");
        }
  
        updates.user = userId;
        checks.user = userId;
  
        // Verify user exists and matches role
        if (existingDuty.role === "Doctor") {
          const doctorExists = await Doctor.exists({ _id: userId });
          if (!doctorExists) throw new ApiError(404, "Doctor not found");
        } else {
          const staffExists = await Staff.exists({ _id: userId });
          if (!staffExists) throw new ApiError(404, "Staff not found");
        }
      }
  
      // Validate and update date
      if (date !== undefined) {
        const newDate = new Date(date);
        if (isNaN(newDate.getTime())) {
          throw new ApiError(400, "Invalid date format");
        }
        updates.date = newDate;
        checks.date = newDate;
      }
  
      // Validate and update shift
      if (shift !== undefined) {
        const { start_time, end_time } = shift;
        
        if (!start_time || !end_time) {
          throw new ApiError(400, "Both start_time and end_time are required");
        }
  
        const startMin = timeToMinutes(start_time);
        const endMin = timeToMinutes(end_time);
  
        if (startMin >= endMin) {
          throw new ApiError(400, "start_time must be before end_time");
        }
  
        updates.shift = {
          start_minutes: startMin,
          end_minutes: endMin,
          start_time,
          end_time
        };
        checks.shift = updates.shift;
      }
  
      // Update room if provided
      if (room !== undefined) {
        updates.room = room;
        checks.room = room;
      }
  
      // Check for conflicts only if relevant fields are being updated
      if (Object.keys(updates).length > 0) {
        const { date, room, user, shift } = checks;
        const startMin = shift.start_minutes;
        const endMin = shift.end_minutes;
  
        // Prepare date range for query (whole day)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
      }
      const userConflict = await Duty.findOne({
        user: userId,
        date: new Date(date),
        "shift.start_time": shift.start_time
      });
  
      if (userConflict) {
        throw new ApiError(409, `This user already has a duty scheduled at this time`);
      }
  
      const roomConflict = await Duty.findOne({
        date: new Date(date),
        room,
        $or: [
          {
            "shift.start_time": { $lt: shift.end_time },
            "shift.end_time": { $gt: shift.start_time }
          }
        ]
      });
  
      if (roomConflict) {
        throw new ApiError(
          409,
          `Room ${room} is already booked from ${roomConflict.shift.start_time} to ${roomConflict.shift.end_time}`
        );
      }
      // Apply updates if no conflicts found
      const updatedDuty = await Duty.findByIdAndUpdate(
        dutyId,
        { $set: updates },
        { 
          new: true, 
          runValidators: true,
          session: req.session // Include if using transactions
        }
      ).populate({
        path: "user",
        select: "name email phone specialization"
      });
  
      if (!updatedDuty) {
        throw new ApiError(500, "Failed to update duty");
      }
  
      return res.status(200).json(
        new ApiResponse(200, updatedDuty, "Duty updated successfully")
      );
  
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(
          new ApiResponse(error.statusCode, null, error.message)
        );
      }
  
      console.error("Error in updateDuty:", error);
      return res.status(500).json(
        new ApiResponse(500, null, "Internal Server Error")
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
  