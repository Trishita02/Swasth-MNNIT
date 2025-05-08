import express from "express";
import {
    addPatient,
    manageMedicineInventory,
    createPrescription,
    searchPatients,
    getAllPatients,
    getPatientById,
    addMedicine,
    getDashboard,
    updateMedicine,
    updateLowStockMedicine,
    deleteMedicine
  } from "../controllers/staff.controller.js";
import { changePassword } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getStaffNotifications,markStaffNotificationAsRead,markAllStaffNotificationsAsRead } from '../controllers/notification.controller.js';

const router = express.Router();
// console.log("reached router");
router.put("/change-password", isAuthenticated, changePassword);
router.post("/addPatient", isAuthenticated,addPatient);
router.post("/manageMedicineInventory", isAuthenticated, manageMedicineInventory);
router.post("/createPresciption", isAuthenticated, createPrescription);
router.post("/addMedicine", isAuthenticated,addMedicine)
router.post("/updateMedicine", isAuthenticated, updateMedicine);
router.post("/updateLowStock",isAuthenticated,updateLowStockMedicine)
router.post("/disposeMedicine", isAuthenticated, deleteMedicine);

router.get("/searchPatients", isAuthenticated, searchPatients);
router.get("/getAllPatients", isAuthenticated, getAllPatients);
router.get("/getPatientbyId/:id", isAuthenticated, getPatientById);
router.get("/dashboard", isAuthenticated, getDashboard)
router.get('/notifications', isAuthenticated,getStaffNotifications);
router.patch('/notifications/:id/read',isAuthenticated,markStaffNotificationAsRead);
router.patch('/notifications/mark-all-read',isAuthenticated, markAllStaffNotificationsAsRead);

export default router;