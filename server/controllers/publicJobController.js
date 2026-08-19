const db = require("../config/db");

async function getPublicJobs(req, res) {
  try {
    const { search = "", location = "", job_type = "" } = req.query;

    const params = [];
    let sql = `
      SELECT
        j.id, j.title, j.description, j.location, j.job_type,
        j.salary, j.skills, j.deadline, j.created_at,
        c.company_name, c.location AS company_location
      FROM jobs j
      JOIN companies c ON c.id = j.company_id
      WHERE j.status = 'approved'
    `;

    if (search) {
      sql += " AND (j.title LIKE ? OR j.skills LIKE ? OR c.company_name LIKE ?)";
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    if (location) {
      sql += " AND j.location LIKE ?";
      params.push(`%${location}%`);
    }

    if (job_type) {
      sql += " AND j.job_type = ?";
      params.push(job_type);
    }

    sql += " ORDER BY j.created_at DESC";

    const [jobs] = await db.execute(sql, params);

    res.json({ count: jobs.length, jobs });
  } catch (error) {
    console.error("PUBLIC JOB ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getJobById(req, res) {
  try {
    const [rows] = await db.execute(
      `SELECT j.*, c.company_name, c.description AS company_description,
              c.website, c.location AS company_location
       FROM jobs j
       JOIN companies c ON c.id = j.company_id
       WHERE j.id = ? AND j.status = 'approved'`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("JOB DETAIL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getPublicJobs, getJobById };