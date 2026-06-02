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

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post(
    "/forgot-password",
    forgotPassword
);

router.put(
    "/reset-password/:token",
    resetPassword
);

router.get("/me", protect, getMe);

module.exports = router;