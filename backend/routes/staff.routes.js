import express from "express";
import {
    addPatient,
    manageMedicineInventory,
    createPrescription,
    searchPatients,
    getAllPatients,
    getPatientById,
  } from "../controllers/staff.controller.js";
import { changePassword } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();
// console.log("reached router");
router.put("/change-password", isAuthenticated, changePassword);
router.post("/addPatient", addPatient);
router.post("/manageMedicineInventory", isAuthenticated, manageMedicineInventory);
router.post("/createPresciption", isAuthenticated, createPrescription);

router.get("/searchPatients", isAuthenticated, searchPatients);
router.get("/getAllPatients", isAuthenticated, getAllPatients);
router.get("/getPatientbyId/:id", isAuthenticated, getPatientById);

export default router;