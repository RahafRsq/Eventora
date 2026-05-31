const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);

router.post("/login", loginUser);

// Forgot Password
router.post(
    "/forgot-password",
    forgotPassword
);

// Reset Password
router.put(
    "/reset-password/:token",
    resetPassword
);

// Current Logged In User
router.get("/me", protect, getMe);

module.exports = router;