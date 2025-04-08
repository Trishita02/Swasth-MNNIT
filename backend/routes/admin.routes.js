import express from "express";
import { addUser } from "../controllers/admin.controller.js";

const router = express.Router();
router.post('/manage-users', addUser);

export default router;
