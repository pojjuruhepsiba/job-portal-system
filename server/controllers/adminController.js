const db = require("../config/db");

async function getDashboardStats(req, res) {
  try {
    const [[users]] = await db.execute(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    const [[jobseekers]] = await db.execute(
      "SELECT COUNT(*) AS total_jobseekers FROM users WHERE role='jobseeker'"
    );
    const [[recruiters]] = await db.execute(
      "SELECT COUNT(*) AS total_recruiters FROM users WHERE role='recruiter'"
    );
    const [[jobs]] = await db.execute(
      "SELECT COUNT(*) AS total_jobs FROM jobs"
    );
    const [[pending]] = await db.execute(
      "SELECT COUNT(*) AS pending_jobs FROM jobs WHERE status='pending'"
    );
    const [[approved]] = await db.execute(
      "SELECT COUNT(*) AS approved_jobs FROM jobs WHERE status='approved'"
    );
    const [[applications]] = await db.execute(
      "SELECT COUNT(*) AS total_applications FROM applications"
    );

    res.json({
      total_users: Number(users.total_users),
      total_jobseekers: Number(jobseekers.total_jobseekers),
      total_recruiters: Number(recruiters.total_recruiters),
      total_jobs: Number(jobs.total_jobs),
      pending_jobs: Number(pending.pending_jobs),
      approved_jobs: Number(approved.approved_jobs),
      total_applications: Number(applications.total_applications)
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUsers(req, res) {
  try {
    const [users] = await db.execute(
      `SELECT id,name,email,role,phone,created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json({ users });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function getPendingJobs(req, res) {
  try {
    const [jobs] = await db.execute(
      `SELECT j.*, c.company_name
       FROM jobs j
       JOIN companies c ON c.id = j.company_id
       WHERE j.status='pending'
       ORDER BY j.created_at DESC`
    );
    res.json({ jobs });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function updateJobStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid job status" });
    }

    const [result] = await db.execute(
      "UPDATE jobs SET status=? WHERE id=?",
      [status, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: `Job ${status} successfully` });
  } catch (error) {
    console.error("UPDATE JOB STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getPendingJobs,
  updateJobStatus
};