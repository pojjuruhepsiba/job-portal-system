const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createCompany,
  getMyCompany,
  getAllCompanies,
} = require("../controllers/companyController");

// Recruiter creates company
router.post(
  "/",
  authMiddleware,
  createCompany
);

// Logged-in recruiter company
router.get(
  "/my",
  authMiddleware,
  getMyCompany
);

// Companies for job dropdown
router.get(
  "/",
  authMiddleware,
  getAllCompanies
);

module.exports = router;