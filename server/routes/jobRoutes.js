

const express = require("express");

const router = express.Router();

const {
  createJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  createJob
);

module.exports = router;