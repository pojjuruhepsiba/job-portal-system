const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

// ======================================================
// POST /api/recruiter/jobs
// ======================================================

router.post("/", authenticate, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const {
      title,
      description,
      location,
      job_type,
      salary,
      skills,
      deadline
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !job_type ||
      !skills ||
      !deadline
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can create jobs"
      });
    }

    // Find company
    const [companies] = await db.query(
      `
      SELECT id, company_name
      FROM companies
      WHERE recruiter_id = ?
      LIMIT 1
      `,
      [recruiterId]
    );

    if (companies.length === 0) {
      return res.status(400).json({
        message: "No company found for this recruiter"
      });
    }

    const companyId = companies[0].id;

    // Insert job
    const [result] = await db.query(
      `
      INSERT INTO jobs
      (
        company_id,
        title,
        description,
        location,
        job_type,
        salary,
        skills,
        deadline,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        companyId,
        title,
        description,
        location,
        job_type,
        salary || null,
        skills,
        deadline,
        "pending"
      ]
    );

    return res.status(201).json({
      message: "Job submitted successfully",
      jobId: result.insertId,
      status: "pending"
    });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });
  }
});


// ======================================================
// GET /api/recruiter/jobs
// ======================================================

router.get("/", authenticate, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can access this"
      });
    }

    const [jobs] = await db.query(
      `
      SELECT
        j.id,
        j.title,
        j.description,
        j.location,
        j.job_type,
        j.salary,
        j.skills,
        j.deadline,
        j.status,
        j.created_at,
        c.company_name
      FROM jobs j
      JOIN companies c
        ON j.company_id = c.id
      WHERE c.recruiter_id = ?
      ORDER BY j.id DESC
      `,
      [recruiterId]
    );

    return res.json({
      count: jobs.length,
      jobs
    });

  } catch (error) {
    console.error("GET RECRUITER JOBS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch recruiter jobs",
      error: error.message
    });
  }
});

module.exports = router;