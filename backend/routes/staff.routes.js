import express from "express";
import {
    changePassword,
    addPatient,
    manageMedicineInventory,
    createPrescription,
    searchPatients,
    getAllPatients,
    getPatientById,
    addMedicine
  } from "../controllers/staff.controller.js";
  
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();
// console.log("reached router");
router.post("/changePassword", isAuthenticated, changePassword);
router.post("/addPatient",  addPatient);
router.post("/manageMedicineInventory", isAuthenticated, manageMedicineInventory);
router.post("/createPresciption", isAuthenticated, createPrescription);
router.post("/addMedicine", addMedicine)

router.get("/searchPatients", isAuthenticated, searchPatients);
router.get("/getAllPatients", isAuthenticated, getAllPatients);
router.get("/getPatientbyId/:id", isAuthenticated, getPatientById);

export default router;