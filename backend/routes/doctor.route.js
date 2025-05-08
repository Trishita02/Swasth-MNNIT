import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { changePassword } from "../controllers/auth.controller.js";
import { getAllPrescriptions, addPrescription, getPrescriptionById, getAllMedicines,printPrescription, getRecentPatients, getDutySchedule } from '../controllers/doctor.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { getDoctorNotifications,markDoctorNotificationAsRead,markAllDoctorNotificationsAsRead } from '../controllers/notification.controller.js';


router.put("/change-password", isAuthenticated, changePassword);
router.get("/getAllPrescriptions", isAuthenticated, getAllPrescriptions);
router.post("/addPrescription",isAuthenticated,
    upload.fields([
      { name: "labReport", maxCount: 1 },
      { name: "scan", maxCount: 1 },
    ]),addPrescription);
router.get("/getPrescriptionById/:reg_no",isAuthenticated, getPrescriptionById)
router.get("/getAllMedicines",isAuthenticated, getAllMedicines)
router.get("/recent-patients", isAuthenticated, getRecentPatients)
router.get("/print-prescription/:id",isAuthenticated,printPrescription)
router.get("/duty-schedule", isAuthenticated, getDutySchedule);
router.get('/notifications', isAuthenticated,getDoctorNotifications);
router.patch('/notifications/:id/read',isAuthenticated,markDoctorNotificationAsRead);
router.patch('/notifications/mark-all-read',isAuthenticated, markAllDoctorNotificationsAsRead);
export default router;