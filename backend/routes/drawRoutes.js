const express = require("express");
const router = express.Router();

const { runDraw } = require("../controllers/drawController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
    "/run",
    authMiddleware,
    adminMiddleware,
    runDraw
);

module.exports = router;