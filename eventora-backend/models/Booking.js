const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            required: true,
        },

        eventType: {
            type: String,
            required: [true, "Event type is required"],
            trim: true,
        },

        eventDate: {
            type: Date,
            required: [true, "Event date is required"],
        },

        eventTime: {
            type: String,
            required: [true, "Event time is required"],
            trim: true,
        },

        eventLocation: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
            maxlength: 200,
        },

        guestsCount: {
            type: Number,
            required: [true, "Guests count is required"],
            min: 1,
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },

        totalPrice: {
            type: Number,
            default: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "Credit Card"],
            default: "Cash",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        paymentDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);