import Staff from "../models/staff.model.js";
import Patient from "../models/patient.model.js";
import Medicine from "../models/medicine.model.js";
import Prescription from "../models/prescription.model.js";
import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";

export const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find().sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const addPrescription = async (req, res) => {
    // console.log("reached for debugging")
    try {
        console.log(req.body);
        const { name, reg_no, doctor_name, diagnosis, prev_issue, remark, investigation, medicines, advice } = req.body;
        // console.log(medicines);
        // Find the patient by reg_no
        const patient = await Patient.findOne({ reg_no });
        // console.log(patient);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Create a new prescription
        // console.log("sefsac")
        const newPrescription = new Prescription({
            name,
            reg_no,
            date_of_visit : new Date(),
            doctor_name,
            diagnosis,
            prev_issue,
            remark,
            investigation,
            medicines,
            patient: patient._id,
            advice,
        });
        console.log(newPrescription);
        // Save the prescription to the database
        await newPrescription.save();

        return res.status(201).json(newPrescription);
    } catch (error) {
        res.status(500).json({ message: "Server error",error:error.message });
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
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}