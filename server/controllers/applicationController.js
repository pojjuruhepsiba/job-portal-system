const db = require("../config/db");

async function applyForJob(req, res) {
  try {
    const { cover_letter = "" } = req.body;

    const [job] = await db.execute(
      "SELECT id FROM jobs WHERE id = ? AND status = 'approved'",
      [req.params.jobId]
    );

    if (!job.length) {
      return res.status(404).json({ message: "Approved job not found" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM applications WHERE job_id = ? AND jobseeker_id = ?",
      [req.params.jobId, req.user.id]
    );

    if (existing.length) {
      return res.status(409).json({ message: "You already applied for this job" });
    }

    const [result] = await db.execute(
      `INSERT INTO applications (job_id,jobseeker_id,cover_letter)
       VALUES (?,?,?)`,
      [req.params.jobId, req.user.id, cover_letter]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId
    });
  } catch (error) {
    console.error("APPLY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function myApplications(req, res) {
  try {
    const [applications] = await db.execute(
      `SELECT
         a.id AS application_id,
         a.job_id,
         a.status,
         a.cover_letter,
         a.applied_at,
         j.title,
         j.location,
         j.job_type,
         j.salary,
         c.company_name
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       JOIN companies c ON c.id = j.company_id
       WHERE a.jobseeker_id = ?
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json({
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("MY APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { applyForJob, myApplications };