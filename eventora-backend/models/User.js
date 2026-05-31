const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: true,
        },

        resetPasswordToken: {
            type: String,
            default: null,
        },

        resetPasswordExpire: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Remove password from response
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    delete userObject.password;

    return userObject;
};

module.exports = mongoose.model("User", userSchema);