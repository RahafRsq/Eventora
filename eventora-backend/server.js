const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:3000",

        credentials: true,
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/packages", packageRoutes);

app.use("/api/bookings", bookingRoutes);

app.use(
    "/api/notifications",
    notificationRoutes
);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Eventora API is running successfully",
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        message:
            err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});