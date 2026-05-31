const Package = require("../models/Package");

// Get All Packages
const getPackages = async (req, res) => {
    try {
        const packages = await Package.find({
            $or: [
                { isActive: true },
                { isActive: { $exists: false } },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            packages,
        });
    } catch (error) {
        console.error("Get Packages Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Featured Packages
const getFeaturedPackages = async (req, res) => {
    try {
        const packages = await Package.find({
            isFeatured: true,
            $or: [
                { isActive: true },
                { isActive: { $exists: false } },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            packages,
        });
    } catch (error) {
        console.error("Featured Packages Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Single Package
const getSinglePackage = async (req, res) => {
    try {
        const packageItem = await Package.findById(req.params.id);

        if (!packageItem) {
            return res.status(404).json({
                success: false,
                message: "Package not found",
            });
        }

        res.status(200).json({
            success: true,
            package: packageItem,
        });
    } catch (error) {
        console.error("Get Single Package Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Create Package
const createPackage = async (req, res) => {
    try {
        const {
            name,
            subtitle,
            price,
            oldPrice,
            discount,
            features,
            image,
            isFeatured,
        } = req.body;

        if (
            !name ||
            !subtitle ||
            price === undefined ||
            oldPrice === undefined ||
            !discount ||
            !features ||
            !Array.isArray(features) ||
            features.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const packageItem = await Package.create({
            name,
            subtitle,
            price,
            oldPrice,
            discount,
            features,
            image,
            isFeatured,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: "Package created successfully",
            package: packageItem,
        });
    } catch (error) {
        console.error("Create Package Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Package
const updatePackage = async (req, res) => {
    try {
        const packageItem = await Package.findById(req.params.id);

        if (!packageItem) {
            return res.status(404).json({
                success: false,
                message: "Package not found",
            });
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Package updated successfully",
            package: updatedPackage,
        });
    } catch (error) {
        console.error("Update Package Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Package
const deletePackage = async (req, res) => {
    try {
        const packageItem = await Package.findById(req.params.id);

        if (!packageItem) {
            return res.status(404).json({
                success: false,
                message: "Package not found",
            });
        }

        await Package.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Package deleted successfully",
        });
    } catch (error) {
        console.error("Delete Package Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getPackages,
    getFeaturedPackages,
    getSinglePackage,
    createPackage,
    updatePackage,
    deletePackage,
};