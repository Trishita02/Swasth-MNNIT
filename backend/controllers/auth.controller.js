import { Admin } from "../models/admin.model.js";
import Staff from "../models/staff.model.js";
import { Doctor } from "../models/doctor.model.js";
import ActivityLog from "../models/activitylog.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config();
const generateToken = async (userId, User) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const accessToken = await user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) throw new ApiError(400, "Email is required");
    if (!password) throw new ApiError(400, "Password is required");

    const role =
      username.match(/\.(st|dr)\d+$/)?.[1] ||
      (username.endsWith(".admin") ? "admin" : undefined);
    let User;
    if (role == "dr") User = Doctor;
    else if (role == "st") User = Staff;
    else User = Admin;
    const user = await User.findOne({ username });
    if (!user) throw new ApiError(404, `User does not exist`);

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, `Invalid user credentials`);
    const accessToken = await generateToken(user._id, User);
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    };
    if (role === 'dr' || role === 'st') {
      const activity = new ActivityLog({
        user: user._id,
        role: role === 'dr' ? 'Doctor' : 'Staff',
        activity: 'Login',
       details: `${username} logged in`
      });
      await activity.save();
    }    
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, { loggedInUser, accessToken }, `${role} logged in`)
      );
  } catch (error) {
    res.status(404).json(new ApiError(404, error.message));
  }
};
export const logoutUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "User not authenticated");
    }

    // Find the user across all roles
    const user =
      (await Staff.findById(req.user._id)) ||
      (await Doctor.findById(req.user._id)) ||
      (await Admin.findById(req.user._id));

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    };
    if (req.role) {  
      try {
        const formattedRole = req.role.charAt(0).toUpperCase() + req.role.slice(1).toLowerCase();
        if (['Staff', 'Doctor'].includes(formattedRole)) {
          const activity = new ActivityLog({
            user: req.user._id,
            role: formattedRole,  
            activity: 'Logout',
            details: `${user.username || user.email || 'Unknown user'} logged out`
          });
          await activity.save();
        }
      } catch (activityError) {
        console.error('Activity log save error:', activityError);
      }
    }

    // Clear cookies securely
    res
      .status(200)
      .clearCookie("accessToken", options)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw new ApiError(400, "All fields are required");
    }
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(400, "New password and confirm password do not match");
    }
    const user = req.user; // user is already attached from isAuthenticated middleware
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    let role;
    if (user instanceof Doctor) {
      role = 'Doctor';
    } else if (user instanceof Staff) {
      role = 'Staff';
    } else {
      role = 'Admin';
    }

    const activity = new ActivityLog({
      user: req.user._id,
      role,
      activity: 'Password Change',
      details: 'changed their password'
    });

await activity.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
