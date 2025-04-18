import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getAllPrescriptions, addPrescription, getPrescriptionById, getAllMedicines } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", getAllPrescriptions);
router.post("/addPrescription", addPrescription);
router.get("/getPrescriptionById/:reg_no", getPrescriptionById)
router.get("/getAllMedicines", getAllMedicines)
export default router;