const mongoose = require("mongoose");
const Package = require("./models/Package");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        await Package.deleteMany({});

        await Package.insertMany([
            {
                name: "Basic",
                subtitle: "Perfect for small elegant events",
                price: 800,
                oldPrice: 1000,
                discount: "20% OFF",
                features: [
                    "Venue Decoration",
                    "Photography",
                    "Basic Catering",
                    "Guest Management",
                ],
                isFeatured: false,
            },
            {
                name: "Premium",
                subtitle: "Most popular package",
                price: 1400,
                oldPrice: 2000,
                discount: "30% OFF",
                features: [
                    "Luxury Decoration",
                    "Professional Photography",
                    "Premium Catering",
                    "Music & Entertainment",
                    "Guest Management",
                ],
                isFeatured: true,
            },
            {
                name: "Luxury",
                subtitle: "Ultimate luxury experience",
                price: 2000,
                oldPrice: 4000,
                discount: "50% OFF",
                features: [
                    "VIP Decoration",
                    "Full Photography & Video",
                    "Luxury Catering",
                    "Live Entertainment",
                    "Personal Event Manager",
                    "Premium Guest Services",
                ],
                isFeatured: false,
            },
        ]);

        console.log("Packages Seeded Successfully");
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });