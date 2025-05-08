import express from "express";
import { addUser,getAllUsers,deleteUser,updateUser,viewActivities,getDashboardDetails} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {changePassword} from "../controllers/auth.controller.js"
import { createNotification,getAllNotifications,deleteNotification } from "../controllers/notification.controller.js";
import {sendDutyChartNow,scheduleDutyChart} from "../controllers/mail.controller.js";  
import { addDuty,deleteDuty,viewAllDuties,getAllDoctors,getAllStaffs } from "../controllers/duty.controller.js";

const router = express.Router();
router.get('/dashboard',getDashboardDetails)
router.post('/manage-users', addUser);
router.get('/manage-users', getAllUsers);
router.delete('/manage-users/:role/:id', deleteUser);
router.put('/manage-users/:role/:id', updateUser);
router.put("/change-password", isAuthenticated, changePassword);
router.post("/create-notifications",createNotification)
router.get("/create-notifications",getAllNotifications)
router.delete("/create-notifications/:id",deleteNotification)
router.get("/activity-logs",viewActivities) 
router.post("/send-dutyChart-now", sendDutyChartNow);
router.post("/schedule-email",scheduleDutyChart);
router.post("/assign-duties",addDuty);
router.delete("/assign-duties/:dutyId",deleteDuty);
router.get("/assign-duties",viewAllDuties);
router.get("/getAllDoctors",getAllDoctors);
router.get("/getAllStaffs",getAllStaffs);
export default router;
