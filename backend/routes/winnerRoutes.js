const express = require("express");
const router = express.Router();

const {
  uploadProof,
  verifyWinner,
} = require("../controllers/winnerController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/upload-proof", authMiddleware, uploadProof);

router.post(
  "/verify",
  authMiddleware,
  adminMiddleware,
  verifyWinner
);

module.exports = router;