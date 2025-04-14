import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { changePassword } from '../controllers/auth.controller.js';
import { getAllPrescriptions, addPrescription } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", getAllPrescriptions);
router.post("/addPrescription", addPrescription);
router.put("/change-password", isAuthenticated, changePassword);
export default router;