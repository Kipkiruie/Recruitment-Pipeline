const express = require("express");
const { getDashboardData } = require("../controllers/analyticsController");
const { protect, verifyRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, verifyRole(["admin", "recruiter"]), getDashboardData);

module.exports = router;
