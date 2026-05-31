const Booking = require("../models/Booking");
const Package = require("../models/Package");
const Notification = require("../models/Notification");

const { sendEmail } = require("../utils/emailService");

const createBooking = async (req, res) => {
    try {
        const {
            package: packageId,
            eventType,
            eventDate,
            eventTime,
            eventLocation,
            guestsCount,
            phoneNumber,
            notes,
            paymentMethod,
            totalPrice,
        } = req.body;

        if (
            !packageId ||
            !eventType ||
            !eventDate ||
            !eventTime ||
            !eventLocation ||
            !guestsCount ||
            !phoneNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const selectedPackage = await Package.findById(packageId);

        if (!selectedPackage) {
            return res.status(404).json({
                success: false,
                message: "Package not found",
            });
        }

        let finalPaymentMethod = paymentMethod || "Cash";
        let finalPaymentStatus = "Pending";
        let paymentDate = null;

        if (finalPaymentMethod === "Credit Card") {
            finalPaymentStatus = "Paid";
            paymentDate = new Date();
        }

        const booking = await Booking.create({
            user: req.user._id,
            package: packageId,
            eventType,
            eventDate,
            eventTime,
            eventLocation,
            guestsCount,
            phoneNumber,
            notes,
            totalPrice: totalPrice || selectedPackage.price,
            paymentMethod: finalPaymentMethod,
            paymentStatus: finalPaymentStatus,
            paymentDate,
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("user", "fullName email")
            .populate("package", "name price subtitle image");

        await sendEmail({
            to: populatedBooking.user.email,
            subject: "Your Eventora Booking Details 💎",
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h1 style="color:#0f5f63;">Booking Confirmed 🎉</h1>
                    <p>Hello ${populatedBooking.user.fullName},</p>
                    <p>Thank you for booking with Eventora. Here are your booking details:</p>

                    <div style="background:#f7f3ff; padding:15px; border-radius:10px;">
                        <p><strong>Package:</strong> ${populatedBooking.package.name}</p>
                        <p><strong>Package Details:</strong> ${populatedBooking.package.subtitle}</p>
                        <p><strong>Price:</strong> ${populatedBooking.totalPrice} JOD</p>
                        <p><strong>Event Type:</strong> ${populatedBooking.eventType}</p>
                        <p><strong>Event Date:</strong> ${new Date(populatedBooking.eventDate).toLocaleDateString()}</p>
                        <p><strong>Event Time:</strong> ${populatedBooking.eventTime}</p>
                        <p><strong>Location:</strong> ${populatedBooking.eventLocation}</p>
                        <p><strong>Guests Count:</strong> ${populatedBooking.guestsCount}</p>
                        <p><strong>Phone Number:</strong> ${populatedBooking.phoneNumber}</p>
                        <p><strong>Status:</strong> ${populatedBooking.status}</p>
                        <p><strong>Payment Method:</strong> ${populatedBooking.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> ${populatedBooking.paymentStatus}</p>
                    </div>

                    ${populatedBooking.notes
                    ? `<p><strong>Notes:</strong> ${populatedBooking.notes}</p>`
                    : ""
                }

                    <p>Our team will review your booking and contact you if needed.</p>
                    <hr />
                    <p>Eventora Team</p>
                </div>
            `,
        });

        await Notification.create({
            role: "admin",
            title: "New Booking",
            message: `${populatedBooking.user.fullName} created a new booking for ${populatedBooking.package.name}`,
            type: "booking",
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: populatedBooking,
        });
    } catch (error) {
        console.error("Create Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "fullName email")
            .populate("package", "name price subtitle image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Get Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id,
        })
            .populate("package", "name price subtitle image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Get My Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status",
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("user", "fullName email")
            .populate("package", "name price subtitle image");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        booking.status = status;

        await booking.save();

        await Notification.create({
            user: booking.user._id,
            role: "user",
            title: "Booking Status Updated",
            message: `Your booking for ${booking.package.name} is now ${booking.status}`,
            type: "status",
        });

        await sendEmail({
            to: booking.user.email,
            subject: `Your Booking Status is now ${status} 💎`,
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h1 style="color:#0f5f63;">Booking Status Updated 💎</h1>
                    <p>Hello ${booking.user.fullName},</p>
                    <p>Your booking status has been updated.</p>

                    <div style="background:#f7f3ff; padding:15px; border-radius:10px;">
                        <p><strong>Package:</strong> ${booking.package.name}</p>
                        <p><strong>Status:</strong> ${booking.status}</p>
                        <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
                        <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> ${booking.eventLocation}</p>
                    </div>

                    <p>Thank you for choosing Eventora 💎</p>
                    <hr />
                    <p>Eventora Team</p>
                </div>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Booking status updated",
            booking,
        });
    } catch (error) {
        console.error("Update Booking Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (booking.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be edited",
            });
        }

        const {
            eventDate,
            eventTime,
            eventLocation,
            guestsCount,
            phoneNumber,
            notes,
        } = req.body;

        booking.eventDate = eventDate || booking.eventDate;
        booking.eventTime = eventTime || booking.eventTime;
        booking.eventLocation = eventLocation || booking.eventLocation;
        booking.guestsCount = guestsCount || booking.guestsCount;
        booking.phoneNumber = phoneNumber || booking.phoneNumber;
        booking.notes = notes ?? booking.notes;

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            booking,
        });
    } catch (error) {
        console.error("Update Booking Details Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getMyBookings,
    updateBookingStatus,
    updateBookingDetails,
};