import mongoose from "mongoose";
import Staff from "../models/staff.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";
import ActivityLog from "../models/activitylog.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addUser = async (req, res) => {
  try {
    const { role, name, email, phone, specialization } = req.body;

    if (!role || !["staff", "doctor"].includes(role)) {
      throw new ApiError(400, "Invalid role provided");
    }
    if (!name || !email || !phone) {
      throw new ApiError(400, "All fields are required");
    }

    const Model = role === "staff" ? Staff : Doctor;

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already exists");
    }

    let newUserData = {
      name,
      email,
      phone,
      password: phone, // default password is phone
    };

    if (role === "doctor") {
      if (!specialization) {
        throw new ApiError(400, "Specialization is required for doctor");
      }
      newUserData.specialization = specialization;
    }

    let newUser = await Model.create(newUserData); // seqNo generated here

    const roleLower = role.toLowerCase();
    const rolePrefix = roleLower === "doctor" ? "dr" : "st";

    newUser.username = `${
      newUser.name.trim().toLowerCase().split(" ")[0]
    }.${rolePrefix}${newUser.seqNo}`;

    await newUser.save(); // save username

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, `${role} created successfully`));
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const staff = await Staff.find();
    const doctors = await Doctor.find();

    const users = [
      ...staff.map((user) => ({ ...user._doc, role: "staff" })),
      ...doctors.map((user) => ({ ...user._doc, role: "doctor" })),
    ];

    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid User ID");
    }

    if (!role || !["staff", "doctor"].includes(role)) {
      throw new ApiError(400, "Invalid Role");
    }

    const Model = role === "staff" ? Staff : Doctor;

    const user = await Model.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, `${role} deleted successfully`));
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

export const updateUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const { name, email, phone, specialization } = req.body;

    if (!["staff", "doctor"].includes(role)) {
      throw new ApiError(400, "Invalid Role");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid User ID");
    }

    const Model = role === "staff" ? Staff : Doctor;

    const user = await Model.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.name = name;
    user.email = email;
    user.phone = phone;

    // Update specialization if doctor
    if (role === "doctor") {
      user.specialization = specialization;
    }

    // Update username -> only first part before '.'
    const existingUsername = user.username; // ex: raj.dr101
    const parts = existingUsername.split(".");
    const roleAndSeq = parts[1]; // dr101 or st5

    const newFirstName = name.trim().toLowerCase().split(" ")[0];

    user.username = `${newFirstName}.${roleAndSeq}`;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

export const viewActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).lean();

    // Get all unique user IDs grouped by role
    const userRefs = {
      Admin: [],
      Staff: [],
      Doctor: [],
    };

    logs.forEach((log) => {
      if (log.user && log.role) {
        userRefs[log.role].push(log.user);
      }
    });

    // Fetch all users in parallel
    const [admins, staff, doctors] = await Promise.all([
      Admin.find({ _id: { $in: userRefs.Admin } })
        .select("name email")
        .lean(),
      Staff.find({ _id: { $in: userRefs.Staff } })
        .select("name email")
        .lean(),
      Doctor.find({ _id: { $in: userRefs.Doctor } })
        .select("name email")
        .lean(),
    ]);

    // Create mapping for quick lookup
    const userMap = {
      Admin: new Map(admins.map((u) => [u._id.toString(), u])),
      Staff: new Map(staff.map((u) => [u._id.toString(), u])),
      Doctor: new Map(doctors.map((u) => [u._id.toString(), u])),
    };

    const formattedLogs = logs.map((log) => {
      const user = userMap[log.role]?.get(log.user?.toString());
      return {
        id: log._id,
        user: user?.name || "",
        email: user?.email || "",
        role: log.role,
        activity: log.activity,
        details: log.details,
        timestamp: log.createdAt,
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedLogs,
          "Activity logs fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error in viewActivity:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, error.message || "Failed to fetch activity logs")
      );
  }
};

export const getDashboardDetails = async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const totalDoctor = await Doctor.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalActivityToday = await ActivityLog.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const latestActivities = await ActivityLog.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", "name")
      .select("user role details createdAt");

    const activities = latestActivities.map((log) => ({
      name: log.user.name,
      description: `${log.details}`,
      createdAt: log.createdAt,
    }));
    res.status(200).json({
      totalStaff,
      totalDoctor,
      totalActivityToday,
      latestActivities: activities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
