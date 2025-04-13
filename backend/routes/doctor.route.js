import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getAllPrescriptions, addPrescription } from '../controllers/doctor.controller.js';

router.get("/getAllPrescriptions", getAllPrescriptions);
router.post("/addPrescription", addPrescription);
export default router;