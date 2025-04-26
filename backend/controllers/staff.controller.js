import Staff from "../models/staff.model.js";
import Patient from "../models/patient.model.js";
import Medicine from "../models/medicine.model.js";
import Prescription from "../models/prescription.model.js";
import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";
import {Duty} from "../models/duty.model.js";
import ActivityLog from "../models/activitylog.model.js"
import jwt from "jsonwebtoken";


// Search Patient Records
export const searchPatients = async (req, res) => {
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
export const manageMedicineInventory = async (req, res) => {
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
export const addPatient = async (req, res) => {
  try {
    // console.log("reachewed")
    const { name, reg_no, age, gender, address, issue, type, blood_group, dob, email, allergies } = req.body;
    const newPatient = new Patient({
      name,
      reg_no,
      issue,
      age,
      gender,
      address,
      email,
      dob, blood_group,
      last_visit: Date.now(),
      allergies,
      type: type // Default type, can be changed later
    });
    await newPatient.save();
    const activity = new ActivityLog({
      user: req.user._id,
      role: 'Staff',
      activity: 'Patient Added',
      details: `Added patient ${name} (${reg_no})`
    });
    await activity.save();
    res.json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create Prescription
export const createPrescription = async (req, res) => {
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
export const sendNotification = async (req, res) => {
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

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ updatedAt: -1 }); // Fetch all patients
    // console.log("Fetched patients:", patients); // Helpful for debugging
    res.status(200).json(patients); // Respond with status 200 and data
  } catch (error) {
    console.error("Error fetching patients:", error.message); // Helpful for debugging
    res.status(500).json({ message: "Server error" });
  }
};
  
export const getPatientById = (req, res) => {
  const { id } = req.params;

  Patient.find({ reg_no: id })
    .then((patient) => {
      if (patient.length === 0) {
        return res.status(404).json({ message: "Patient not found" }); // Use 404
      }
      res.status(200).json(patient[0]); // Return single object directly
    })
    .catch((error) => {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Server error" });
    });
};

export const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      batchNumber,
      type,
      expiryDate,
      quantity,
      invoiceDate,
      invoiceNumber,
      supplier,
    } = req.body;
    // Check if medicine with the same name already exists
    const existingMedicine = await Medicine.findOne({ name: medicineName, category: type });
    if (existingMedicine) {
      return res.status(409).json({
        message: "This medicine is already added. Please update the existing record instead.",
      });
    }

    // console.log("medicineName type:", typeof medicineName);
    // console.log("batchNumber type:", typeof batchNumber);
    // console.log("type type:", typeof type);
    // console.log("expiryDate type:", typeof expiryDate);
    // console.log("quantity type:", typeof quantity);
    // console.log("invoiceDate type:", typeof invoiceDate);
    // console.log("invoiceNumber type:", typeof invoiceNumber);
    // console.log("supplier type:", typeof supplier);
    
    // Validate input data
    // if (!medicineName || !batchNumber || !type || !expiryDate || !quantity || !invoiceDate || !invoiceNumber || !supplier) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
    // Ensure dates are valid
    const parsedExpiryDate = new Date(expiryDate);
    const parsedInvoiceDate = new Date(invoiceDate);
    // console.log("pass1")

    // if (isNaN(parsedExpiryDate) || isNaN(parsedInvoiceDate)) {
    //   return res.status(400).json({ message: "Invalid date format" });
    // }
    // console.log("pass2")
    const newBatch = {
      batch_no: batchNumber,
      expiry: parsedExpiryDate,  
      b_quantity: quantity,
      invoice_date: parsedInvoiceDate,  
      invoice_no: invoiceNumber,
    };

    // Create a new medicine object with the batches
    const newMedicine = new Medicine({
      name: medicineName,
      category: type,  
      stock: quantity,
      unit: "strips",  
      expiry: parsedExpiryDate,  
      batches: [newBatch],  
      supplier: supplier,  
    });

    // Save the new medicine object to the database
    await newMedicine.save();
    // console.log("pass3")
    // Respond with success message and the new medicine data
    // console.log(req.user)
    const activity = new ActivityLog({
      user: req.user._id,
      role: 'Staff',
      activity: 'Medicine Added',
      details: `Added ${quantity} units of ${medicineName}`
    });
    await activity.save();
    
    res.status(200).json({
      message: "Medicine added successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
      //console.log(req.user._id);
      const userId = req.user._id; // Authenticated user from middleware
      const staff = await Staff.findById(userId);  // Get the 5 most recent patients
      const dutyIds = staff.duties;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to today's start (midnight)

          const upcomingDuties = await Duty.find({
          _id: { $in: dutyIds },
          date: { $gte: today }
          })
          .sort({ date: 1 }) // Ascending order
          .limit(5); // Limit to 5 upcoming

          
      res.json({ upcomingDuties: upcomingDuties});
  } catch (error) {
      console.error("Error fetching recent patients:", error);
      res.status(500).json({ message: "Server error" });
  }
}

export const updateMedicine = async (req, res) => {
  try {
    // console.log(req.body);
    const { id, medicineName, batchNumber, type, expiryDate, quantity, invoiceDate, invoiceNumber, supplier } = req.body;
    
    // Validate input data
    if (!medicineName || !batchNumber || !type || !expiryDate || !quantity || !invoiceDate || !invoiceNumber || !supplier) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Ensure dates are valid
    const parsedExpiryDate = new Date(expiryDate);
    const parsedInvoiceDate = new Date(invoiceDate);

    if (isNaN(parsedExpiryDate) || isNaN(parsedInvoiceDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const duplicate = await Medicine.findOne({
      _id: { $ne: id }, // Exclude the current record
      name: medicineName,
      category: type,
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Another medicine with the same name and type already exists.",
      });
    }
    // Find the medicine by ID and update it
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id, 
      {
        $set: {
          name: medicineName,
          category: type,
          stock: quantity,
          unit: "strips",
          expiry: parsedExpiryDate,
          batches: [{
            batch_no: batchNumber,
            expiry: parsedExpiryDate,
            b_quantity: quantity,
            invoice_date: parsedInvoiceDate,
            invoice_no: invoiceNumber,
          }],
          supplier: supplier,
        },
      },
      { new: true }
    );
    

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    const activity = new ActivityLog({
      user: req.user._id,
      role: 'Staff',
      activity: 'Medicine Updated',
      details: `Updated medicine ${medicineName} details`
    });
    await activity.save();
    // Respond with success message and the updated medicine data
    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const updateLowStockMedicine=async(req,res)=>{
  try {
    const { id, quantity } = req.body;
    
    if (!id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { $set: { stock: quantity } },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.body; // Assuming you're sending the ID in the request body

    // Find and delete the medicine by ID
    // console.log(id)
    const deletedMedicine = await Medicine.findOneAndDelete({ _id: id });

    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    const activity = new ActivityLog({
      user: req.user._id,
      role: 'Staff',
      activity: 'Medicine Deleted',
      details: `Deleted medicine ${deletedMedicine.name}`
    });
    await activity.save();
    // Respond with success message
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
}
