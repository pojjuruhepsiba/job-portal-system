const db = require("../config/db");

async function getApplicants(req, res) {
  try {
    const [applications] = await db.execute(
      `SELECT
         a.id AS application_id,
         a.job_id,
         a.jobseeker_id,
         a.status,
         a.cover_letter,
         a.applied_at,
         u.name AS applicant_name,
         u.email AS applicant_email,
         u.phone AS applicant_phone,
         j.title,
         c.company_name
       FROM applications a
       JOIN users u ON u.id = a.jobseeker_id
       JOIN jobs j ON j.id = a.job_id
       JOIN companies c ON c.id = j.company_id
       WHERE c.recruiter_id = ?
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json({
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("GET APPLICANTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["applied", "shortlisted", "rejected", "selected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const [result] = await db.execute(
      `UPDATE applications a
       JOIN jobs j ON j.id = a.job_id
       JOIN companies c ON c.id = j.company_id
       SET a.status = ?
       WHERE a.id = ? AND c.recruiter_id = ?`,
      [status, req.params.id, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getApplicants, updateApplicationStatus };