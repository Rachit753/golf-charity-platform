const express = require("express");
const router = express.Router();

const { runDraw } = require("../controllers/drawController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/run", authMiddleware, runDraw);

module.exports = router;