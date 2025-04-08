import { Staff } from "../models/staff.js";
import { Doctor } from "../models/doctor.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addUser = async (req, res) => {
  try {
    const { role, name, email, phone, specialization } = req.body;

    if (!role || !['staff', 'doctor'].includes(role)) {
      throw new ApiError(400, 'Invalid role provided');
    }
    if (!name || !email || !phone) {
      throw new ApiError(400, 'All fields are required');
    }

    const Model = role === 'staff' ? Staff : Doctor;

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }

    let newUserData = {
      name,
      email,
      phone,
      password: phone, // default password is phone
    }

    if (role === 'doctor') {
      if (!specialization) {
        throw new ApiError(400, 'Specialization is required for doctor');
      }
      newUserData.specialization = specialization;
    }

    let newUser = await Model.create(newUserData);  // seqNo generated here

    const roleLower = role.toLowerCase();
    const rolePrefix = roleLower === 'doctor' ? 'dr' : 'st';

    newUser.username = `${newUser.name.trim().toLowerCase().split(" ")[0]}.${rolePrefix}${newUser.seqNo}`;

    await newUser.save();  // save username

    return res.status(201).json(
      new ApiResponse(201, newUser, `${role} created successfully`)
    );

  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, error.message || 'Internal Server Error')
    );
  }
}
