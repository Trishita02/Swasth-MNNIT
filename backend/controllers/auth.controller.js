import {Admin} from "../models/admin.model.js";
import {Staff} from "../models/staff.js";
import {Doctor} from "../models/doctor.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import dotenv from "dotenv"
dotenv.config()
const generateToken = async (userId, User) => {
    try {
        const user=await User.findById(userId)
        if (!user) throw new ApiError(404, "User not found")
        const accessToken = await user.generateAccessToken();
        return accessToken;
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};
export const loginUser = async (req, res) => {
    try {
        const { username, password} = req.body;
        if (!username) throw new ApiError(400, "Email is required");
        if (!password) throw new ApiError(400, "Password is required");

        const role=username.split('.')[1]
        let User;
        if(role=="admin") User=Admin
        else if(role=="staff") User=Staff
        else User=Doctor
        const user=await User.findOne({username})
        if (!user) throw new ApiError(404, `User does not exist`);

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) throw new ApiError(401, `Invalid user credentials`);
        const accessToken = await generateToken(user._id, User);
        const loggedInUser=await User.findById(user._id).select("-password")

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, { loggedInUser, accessToken }, `${role} logged in`));
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
        };

        // Clear cookies securely
        res.status(200)
            .clearCookie("accessToken", options)
            .json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json(new ApiError(500, error.message));
    }
};
