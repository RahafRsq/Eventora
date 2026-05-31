const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
    sendEmail,
} = require("../utils/emailService");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const userExists = await User.findOne({
            email: email.toLowerCase(),
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Welcome Email
        await sendEmail({
            to: user.email,
            subject: "Welcome to Eventora 💎",
            html: `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color:#0f5f63;">
            Welcome to Eventora 🎉
          </h1>

          <p>Hello ${user.fullName},</p>

          <p>
            Thank you for joining Eventora.
          </p>

          <p>
            You can now explore packages and book
            your perfect event easily.
          </p>

          <p>
            We are excited to have you with us 💎
          </p>

          <hr />

          <p>
            Eventora Team
          </p>
        </div>
      `,
        });

        const token = generateToken(
            user._id,
            user.role
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user,
        });
    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter email and password",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(
            user._id,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate reset token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetURL = `${process.env.CLIENT_URL
            }/reset-password/${resetToken}`;

        // Send reset email
        await sendEmail({
            to: user.email,
            subject:
                "Reset Your Eventora Password 💎",
            html: `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color:#0f5f63;">
            Password Reset Request 🔐
          </h1>

          <p>Hello ${user.fullName},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetURL}"
            style="
              display:inline-block;
              margin-top:20px;
              padding:14px 28px;
              background:#0f766e;
              color:white;
              text-decoration:none;
              border-radius:999px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:25px;">
            This link will expire in 15 minutes.
          </p>

          <hr />

          <p>
            Eventora Team
          </p>
        </div>
      `,
        });

        res.status(200).json({
            success: true,
            message:
                "Password reset email sent successfully",
        });
    } catch (error) {
        console.error(
            "Forgot Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,

            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid or expired reset token",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        user.password = hashedPassword;

        user.resetPasswordToken = null;

        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Password reset successfully",
        });
    } catch (error) {
        console.error(
            "Reset Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Current User
const getMe = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("GetMe Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getMe,
};