const Staff = require("../models/Staff");
const Patient = require("../models/Patient");
const Medicine = require("../models/Medicine");
const Prescription = require("../models/Prescription");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { staffId, oldPassword, newPassword } = req.body;
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await bcrypt.compare(oldPassword, staff.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    staff.password = await bcrypt.hash(newPassword, 10);
    await staff.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search Patient Records
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Check Medicine Inventory & Add New Batch
exports.manageMedicineInventory = async (req, res) => {
  try {
    const { name, quantity, expiryDate } = req.body;
    let medicine = await Medicine.findOne({ name });

    if (medicine) {
      medicine.quantity += quantity;
      medicine.expiryDate = expiryDate;
    } else {
      medicine = new Medicine({ name, quantity, expiryDate });
    }

    await medicine.save();
    res.json({ message: "Medicine inventory updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add New Patient
exports.addPatient = async (req, res) => {
  try {
    const { name, email, phone, age, gender, address } = req.body;
    const newPatient = new Patient({
      name,
      email,
      phone,
      age,
      gender,
      address,
    });
    await newPatient.save();
    res.json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create Prescription
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, dosage, instructions } = req.body;
    const newPrescription = new Prescription({
      patientId,
      medicines,
      dosage,
      instructions,
    });
    await newPrescription.save();
    res.json({
      message: "Prescription created successfully",
      prescription: newPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send Notification
exports.sendNotification = async (req, res) => {
  try {
    const { staffId, message } = req.body;
    const newNotification = new Notification({ staffId, message });
    await newNotification.save();
    res.json({
      message: "Notification sent successfully",
      notification: newNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
