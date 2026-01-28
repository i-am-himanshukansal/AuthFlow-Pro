import express from "express";
import {forgotPassword, getUser, login, logout, register, resetPassword, verifyOtp} from '../controllers/userController.js'
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/register",register);
router.post("/otp-verification",verifyOtp);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/getUser",isAuthenticated,getUser);
router.post(`/password/forgot`, forgotPassword);
router.post("/password/reset/:token", resetPassword);
export default router;