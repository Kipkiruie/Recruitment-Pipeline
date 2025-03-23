const express = require("express");
const { scheduleInterview, getInterviews } = require("../controllers/interviewController");
const { protect, verifyRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/schedule", protect, verifyRole(["recruiter", "admin"]), scheduleInterview);
router.get("/", protect, verifyRole(["recruiter", "admin"]), getInterviews);

module.exports = router;
