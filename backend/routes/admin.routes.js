import express from "express";
import { addUser,getAllUsers,deleteUser,updateUser} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {changePassword} from "../controllers/auth.controller.js"
import { createNotification,getAllNotifications,deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();
router.post('/manage-users', addUser);
router.get('/manage-users', getAllUsers);
router.delete('/manage-users/:role/:id', deleteUser);
router.put('/manage-users/:role/:id', updateUser);
router.put("/change-password", isAuthenticated, changePassword);
router.post("/create-notifications",createNotification)
router.get("/create-notifications",getAllNotifications)
router.delete("/create-notifications/:id",deleteNotification)
export default router;
