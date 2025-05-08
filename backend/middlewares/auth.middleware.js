import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import Staff from "../models/staff.model.js";
import { Admin } from "../models/admin.model.js";
import dotenv from "dotenv";

dotenv.config();
export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Access token required");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded._id) {
      throw new ApiError(401, "Invalid access token");
    }

    // Identify user role and fetch user details
    let user =
      (await Doctor.findById(decoded._id)) ||
      (await Staff.findById(decoded._id)) ||
      (await Admin.findById(decoded._id));

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user; // Attach user to request
    if (await Doctor.findById(decoded._id)) {
      req.role = "doctor";
    } else if (await Staff.findById(decoded._id)) {
      req.role = "staff";
    } else if (await Admin.findById(decoded._id)) {
      req.role = "admin";
    }
    next();
  } catch (error) {
    next(error);
  }
};
