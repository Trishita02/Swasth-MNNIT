import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getAllPrescriptions, addPrescription, getPrescriptionById, getAllMedicines } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", isAuthenticated, getAllPrescriptions);
router.post("/addPrescription",isAuthenticated, addPrescription);
router.get("/getPrescriptionById/:reg_no",isAuthenticated, getPrescriptionById)
router.get("/getAllMedicines",isAuthenticated, getAllMedicines)

export default router;