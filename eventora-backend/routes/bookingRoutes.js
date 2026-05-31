const express = require("express");

const {
    createBooking,
    getBookings,
    getMyBookings,
    updateBookingStatus,
    updateBookingDetails,
} = require("../controllers/bookingController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.put("/edit/:id", protect, updateBookingDetails);

router.get("/", protect, adminOnly, getBookings);

router.put("/:id", protect, adminOnly, updateBookingStatus);

module.exports = router;