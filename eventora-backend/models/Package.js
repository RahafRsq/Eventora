const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Package name is required"],
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        subtitle: {
            type: String,
            required: [true, "Subtitle is required"],
            trim: true,
            maxlength: 200,
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },

        oldPrice: {
            type: Number,
            required: [true, "Old price is required"],
            min: 0,
        },

        discount: {
            type: String,
            required: [true, "Discount is required"],
            trim: true,
        },

        features: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr) {
                    return arr.length > 0;
                },
                message: "At least one feature is required",
            },
        },

        image: {
            type: String,
            default: "",
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Package", packageSchema);