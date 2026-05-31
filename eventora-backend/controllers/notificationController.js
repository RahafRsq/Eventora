const Notification = require("../models/Notification");

// Get logged-in user notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        console.error("Get My Notifications Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get admin notifications
const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            role: "admin",
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        console.error("Get Admin Notifications Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        if (
            notification.user &&
            notification.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not allowed",
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error("Mark Notification Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Mark all user notifications as read
const markAllMyNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.user._id,
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Mark All Notifications Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Mark all admin notifications as read
const markAllAdminNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                role: "admin",
            },
            {
                isRead: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "All admin notifications marked as read",
        });
    } catch (error) {
        console.error("Mark Admin Notifications Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getMyNotifications,
    getAdminNotifications,
    markNotificationAsRead,
    markAllMyNotificationsAsRead,
    markAllAdminNotificationsAsRead,
};