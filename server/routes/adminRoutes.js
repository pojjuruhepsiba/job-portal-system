const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getDashboardStats,
  getUsers,
  getPendingJobs,
  updateJobStatus
} = require("../controllers/adminController");

router.get("/dashboard", auth, role("admin"), getDashboardStats);
router.get("/users", auth, role("admin"), getUsers);
router.get("/jobs/pending", auth, role("admin"), getPendingJobs);
router.patch("/jobs/:id/status", auth, role("admin"), updateJobStatus);

module.exports = router;