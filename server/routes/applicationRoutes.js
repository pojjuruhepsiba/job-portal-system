const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

// ======================================================
// POST /api/applications
// Apply for a job
// ======================================================

router.post("/", authenticate, async (req, res) => {
  try {
    console.log("========== APPLY JOB ==========");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    // Only jobseekers can apply
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can apply for jobs"
      });
    }

    const jobseekerId = req.user.id;

    const {
      job_id,
      cover_letter
    } = req.body;

    if (!job_id) {
      return res.status(400).json({
        message: "Job ID is required"
      });
    }

    // ==================================================
    // CHECK JOB
    // ==================================================

    const [jobs] = await db.query(
      `
      SELECT
        id,
        title,
        status,
        deadline
      FROM jobs
      WHERE id = ?
      LIMIT 1
      `,
      [job_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const job = jobs[0];

    // Only approved jobs
    if (job.status !== "approved") {
      return res.status(400).json({
        message: "This job is not available for applications"
      });
    }

    // ==================================================
    // CHECK DEADLINE
    // ==================================================

    if (job.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadline = new Date(job.deadline);
      deadline.setHours(0, 0, 0, 0);

      if (deadline < today) {
        return res.status(400).json({
          message: "Application deadline has passed"
        });
      }
    }

    // ==================================================
    // CHECK DUPLICATE APPLICATION
    // ==================================================

    const [existingApplications] = await db.query(
      `
      SELECT id
      FROM applications
      WHERE job_id = ?
      AND jobseeker_id = ?
      LIMIT 1
      `,
      [job_id, jobseekerId]
    );

    if (existingApplications.length > 0) {
      return res.status(409).json({
        message: "You have already applied for this job"
      });
    }

    // ==================================================
    // INSERT APPLICATION
    // ==================================================

    const [result] = await db.query(
      `
      INSERT INTO applications
      (
        job_id,
        jobseeker_id,
        cover_letter,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        job_id,
        jobseekerId,
        cover_letter || null,
        "applied"
      ]
    );

    console.log(
      "APPLICATION CREATED:",
      result.insertId
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId
    });

  } catch (error) {
    console.error(
      "APPLY JOB ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ======================================================
// GET /api/applications/my
// Jobseeker applications
// ======================================================

router.get("/my", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can view applications"
      });
    }

    const [applications] = await db.query(
      `
      SELECT
        a.id,
        a.job_id,
        a.jobseeker_id,
        a.cover_letter,
        a.status,
        a.applied_at,

        j.title,
        j.location,
        j.job_type,
        j.salary,
        j.skills,
        j.deadline,

        c.company_name

      FROM applications a

      JOIN jobs j
        ON a.job_id = j.id

      JOIN companies c
        ON j.company_id = c.id

      WHERE a.jobseeker_id = ?

      ORDER BY a.applied_at DESC
      `,
      [req.user.id]
    );

    return res.json({
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;