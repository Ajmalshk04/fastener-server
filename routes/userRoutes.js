// userRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;
