const express = require("express");

const {
    getMyNotifications,
    getAdminNotifications,
    markNotificationAsRead,
    markAllMyNotificationsAsRead,
    markAllAdminNotificationsAsRead,
} = require("../controllers/notificationController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyNotifications);

router.put("/my/read-all", protect, markAllMyNotificationsAsRead);

// Admin notifications
router.get(
    "/admin",
    protect,
    adminOnly,
    getAdminNotifications
);

router.put(
    "/admin/read-all",
    protect,
    adminOnly,
    markAllAdminNotificationsAsRead
);

router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;