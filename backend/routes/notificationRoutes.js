const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id", protect, markAsRead);

module.exports = router;
