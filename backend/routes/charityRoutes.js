const express = require("express");
const router = express.Router();

const {
  getCharities,
  selectCharity,
  getUserCharity,
} = require("../controllers/charityController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getCharities);

router.post("/select", authMiddleware, selectCharity);

router.get("/my", authMiddleware, getUserCharity);

module.exports = router;