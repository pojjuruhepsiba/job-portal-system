const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getApplicants,
  updateApplicationStatus
} = require("../controllers/recruiterApplicationController");

router.get("/", auth, role("recruiter"), getApplicants);
router.patch("/:id/status", auth, role("recruiter"), updateApplicationStatus);

module.exports = router;