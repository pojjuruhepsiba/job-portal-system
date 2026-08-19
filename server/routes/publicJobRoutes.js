const express = require("express");
const router = express.Router();
const {
  getPublicJobs,
  getJobById
} = require("../controllers/publicJobController");

router.get("/", getPublicJobs);
router.get("/:id", getJobById);

module.exports = router;
