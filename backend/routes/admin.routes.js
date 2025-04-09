import express from "express";
import { addUser,getAllUsers,deleteUser,updateUser} from "../controllers/admin.controller.js";

const router = express.Router();
router.post('/manage-users', addUser);
router.get('/manage-users', getAllUsers);
router.delete('/manage-users/:role/:id', deleteUser);
router.put('/manage-users/:role/:id', updateUser);


export default router;
