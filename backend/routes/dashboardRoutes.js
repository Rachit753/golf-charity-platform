const express = require("express");
const router = express.Router();

const {
  getUserDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User dashboard
router.get("/user", authMiddleware, getUserDashboard);

// Admin dashboard
router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
);

module.exports = router;