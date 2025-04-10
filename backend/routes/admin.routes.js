import express from "express";
import { addUser,getAllUsers,deleteUser,updateUser} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {changePassword} from "../controllers/auth.controller.js"

const router = express.Router();
router.post('/manage-users', addUser);
router.get('/manage-users', getAllUsers);
router.delete('/manage-users/:role/:id', deleteUser);
router.put('/manage-users/:role/:id', updateUser);
router.put("/change-password", isAuthenticated, changePassword);

export default router;
