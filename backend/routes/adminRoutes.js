const express = require("express");
const { listUsers, deleteUser } = require("../controllers/adminController");
const { protect, verifyRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/users", protect, verifyRole(["admin"]), listUsers);
router.delete("/users/:id", protect, verifyRole(["admin"]), deleteUser);

module.exports = router;
