import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
<<<<<<< HEAD
import { getAllPrescriptions, addPrescription, getPrescriptionById, getAllMedicines } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", getAllPrescriptions);
router.post("/addPrescription", addPrescription);
router.get("/getPrescriptionById/:reg_no", getPrescriptionById)
router.get("/getAllMedicines", getAllMedicines)
=======
import { changePassword } from '../controllers/auth.controller.js';
import { getAllPrescriptions, addPrescription } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", getAllPrescriptions);
router.post("/addPrescription", addPrescription);
router.put("/change-password", isAuthenticated, changePassword);
>>>>>>> d3a988a3c455296cdb374c3583195363984a6dd7
export default router;