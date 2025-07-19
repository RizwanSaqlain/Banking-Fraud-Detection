import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  checkAuth,
  deleteAccount,
} from "../controller/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
