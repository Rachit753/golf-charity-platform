const express = require("express");
const router = express.Router();

const { addScore } = require("../controllers/scoreController");
const authMiddleware = require("../middleware/authMiddleware");
const subscriptionMiddleware = require("../middleware/subscriptionMiddleware");

router.post(
  "/add",
  authMiddleware,
  subscriptionMiddleware,
  addScore
);

module.exports = router;