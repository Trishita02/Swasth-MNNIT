import express from 'express'
import {sendCode, verifyCode,getUser} from '../controllers/home.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post("/sendCode", sendCode);
router.post("/verifyCode", verifyCode);
router.get("/user",isAuthenticated,getUser);






export default router;