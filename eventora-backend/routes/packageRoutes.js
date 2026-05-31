const express = require("express");

const {
    getPackages,
    getFeaturedPackages,
    getSinglePackage,
    createPackage,
    updatePackage,
    deletePackage,
} = require("../controllers/packageController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getPackages);

router.get("/featured", getFeaturedPackages);

router.get("/:id", getSinglePackage);

// Admin Routes
router.post(
    "/",
    protect,
    adminOnly,
    createPackage
);

router.put(
    "/:id",
    protect,
    adminOnly,
    updatePackage
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deletePackage
);

module.exports = router;