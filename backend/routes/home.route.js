import express from 'express'
import {sendCode, verifyCode} from '../controllers/home.controller.js'

const router = express.Router();


router.post("/sendCode", sendCode);
router.post("/verifyCode", verifyCode);






export default router;