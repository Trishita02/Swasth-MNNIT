import Staff from "../models/staff.model.js";
import Patient from "../models/patient.model.js";
import Medicine from "../models/medicine.model.js";
import Prescription from "../models/prescription.model.js";
import {Doctor} from "../models/doctor.model.js";
import {Duty}   from "../models/duty.model.js";
import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { generateAndSendPrescription } from "./mail.controller.js";

export const getAllPrescriptions = async (req, res) => {
    try {
        // console.log("Authenticated User:", req.user);
        const userId = req.user._id; // Authenticated user from middleware
        // console.log(userId);
        const prescriptions = await Prescription.find({ doctor_id: userId }).sort({ createdAt: -1 });
        // console.log(prescriptions)
        res.json(prescriptions);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// export const getAllPrescriptions = async (req, res) => {
//     console.log(req);
//     try {
//         const prescriptions = await Prescription.find().sort({ createdAt: -1 });
//         res.json(prescriptions);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// }

export const addPrescription = async (req, res) => {
    // console.log("reached for debugging")
    try {
        // console.log(req.body);
        const { name, reg_no, diagnosis, prev_issue, remark, investigation, medicines, advice } = req.body;
        // console.log(medicines);
        // Find the patient by reg_no
        const patient = await Patient.findOne({ reg_no });
        // console.log(patient);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Create a new prescription
        // console.log("sefsac")
        const userId = req.user._id;
        const newPrescription = new Prescription({
            name,
            reg_no,
            date_of_visit: new Date(),
            doctor_id: userId,
            diagnosis,
            prev_issue,
            remark,
            investigation,
            medicines,
            patient: patient._id,
            advice,
        });
        // console.log(newPrescription);
        // Save the prescription to the database
        Doctor.findByIdAndUpdate(userId, { $push: { patients: patient._id } }, { new: true })
        .then((doctor) => {
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            // console.log("Doctor updated successfully:", doctor);
        })
        await newPrescription.save();
        


        // 1. Handle file uploads (via Multer)
    const uploadedFiles = [];
    if (req.files?.labReport) {
      const labReportUrl = await uploadOnCloudinary(req.files.labReport[0].path);
      if (labReportUrl) uploadedFiles.push({
        filename: "lab_report.pdf",
        path: labReportUrl.url,
      });
    }
    if (req.files?.scan) {
      const scanUrl = await uploadOnCloudinary(req.files.scan[0].path);
      if (scanUrl) uploadedFiles.push({
        filename: "scan.pdf",
        path: scanUrl.url,
      });
    }
        await newPrescription.populate('doctor_id');
        await newPrescription.populate('patient');
        await generateAndSendPrescription(newPrescription,uploadedFiles);
        return res.status(201).json(newPrescription);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getPrescriptionById = async (req, res) => {
    try {
        const reg_no = req.params.reg_no;
        const prescription = await Prescription.find({ reg_no });
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        console.log(medicines)
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const printPrescription = async (req, res) => {
    try {
      const { id } = req.params;
  
      const prescription = await Prescription.findById(id)
      .populate('doctor_id', 'name specialization phone')  
      .populate('patient', 'name reg_no age gender')
  
      if (!prescription) {
        return res.status(404).send("Prescription not found.");
      }
      res.render("prescriptionTemplate", { prescription });
    } catch (error) {
      console.error("Error rendering prescription by ID:", error);
      res.status(500).send("Something went wrong.");
    }
  };

export const getRecentPatients = async (req, res) => {
    try {
        //console.log(req.user._id);
        const userId = req.user._id; // Authenticated user from middleware
        const doctor = await Doctor.findById(userId);  // Get the 5 most recent patients
            console.log(doctor);//
        const patients = doctor.patients; // Assuming patients is   an array of patient IDs
        const recentPatients = await Patient.find({ _id: { $in: patients } })
            .sort({ createdAt: -1 })
            .limit(5); // Get the 5 most recent patients
            const dutyIds = doctor.duties; // Assuming duties is an array of duty IDs
            // console.log(dutyIds);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to today's start (midnight)

            const upcomingDuties = await Duty.find({
            _id: { $in: dutyIds },
            date: { $gte: today }
            })
            .sort({ date: 1 }) // Ascending order
            .limit(5); // Limit to 5 upcoming

            
        res.json({recentPatients:recentPatients, upcomingDuties: upcomingDuties});
    } catch (error) {
        console.error("Error fetching recent patients:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getDutySchedule = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user from middleware
        // if(req.user.role == 'Staff')
        let user;
        if(!req.user.specialization)user = await Staff.findById(userId);
        else user = await Doctor.findById(userId);
        // const user = await db.findById(userId);
        if (!user){
            return res.status(404).json({ message: "Doctor not found" });
        }
        // console.log(user);
        const dutyIds = user.duties;
        // console.log(doctor.duties);
        const duties = await Duty.find({ _id: { $in: dutyIds } });
        // const duties = doctor.duties;
        res.json(duties);
    } catch (error) {
        console.error("Error fetching duty schedule:", error);
        res.status(500).json({ message: "Server error" });
    }
}

  