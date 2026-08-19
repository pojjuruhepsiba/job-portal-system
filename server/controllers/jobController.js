const db = require("../config/db");

// =====================================================
// CREATE JOB
// =====================================================
const createJob = async (req, res) => {
  try {
    // -------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized. Please login again.",
      });
    }

    const recruiterId = req.user.id;

    // -------------------------------------------------
    // GET DATA
    // -------------------------------------------------
    const {
      company_name,
      title,
      description,
      location,
      job_type,
      salary,
      skills,
      deadline,
    } = req.body;

    // -------------------------------------------------
    // REQUIRED FIELDS
    // -------------------------------------------------
    if (
      !company_name ||
      !title ||
      !description ||
      !location ||
      !job_type ||
      !salary ||
      !skills ||
      !deadline
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // -------------------------------------------------
    // CLEAN DATA
    // -------------------------------------------------
    const companyName = String(company_name).trim();
    const jobTitle = String(title).trim();
    const jobDescription = String(description).trim();
    const jobLocation = String(location).trim();
    const jobType = String(job_type).trim();
    const jobSalary = String(salary).trim();
    const jobSkills = String(skills).trim();

    // -------------------------------------------------
    // VALIDATE DEADLINE
    // Supports:
    // YYYY-MM-DD
    // DD-MM-YYYY
    // -------------------------------------------------
    let formattedDeadline = deadline;

    const deadlineString = String(deadline).trim();

    // DD-MM-YYYY -> YYYY-MM-DD
    if (/^\d{2}-\d{2}-\d{4}$/.test(deadlineString)) {
      const [day, month, year] = deadlineString.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
      ) {
        return res.status(400).json({
          message: "Invalid deadline date.",
        });
      }

      formattedDeadline = `${year}-${month}-${day}`;
    }

    // YYYY-MM-DD
    else if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineString)) {
      const [year, month, day] = deadlineString.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
      ) {
        return res.status(400).json({
          message: "Invalid deadline date.",
        });
      }

      formattedDeadline = deadlineString;
    }

    else {
      return res.status(400).json({
        message:
          "Invalid deadline format. Use DD-MM-YYYY or YYYY-MM-DD.",
      });
    }

    // -------------------------------------------------
    // FIND COMPANY
    // -------------------------------------------------
    const [existingCompanies] = await db.execute(
      `
      SELECT id
      FROM companies
      WHERE LOWER(TRIM(company_name)) = LOWER(?)
      AND recruiter_id = ?
      LIMIT 1
      `,
      [companyName, recruiterId]
    );

    let companyId;

    // -------------------------------------------------
    // CREATE COMPANY IF NOT EXISTS
    // -------------------------------------------------
    if (existingCompanies.length === 0) {
      const [companyResult] = await db.execute(
        `
        INSERT INTO companies
        (
          company_name,
          description,
          website,
          location,
          recruiter_id
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          companyName,
          "",
          "",
          jobLocation,
          recruiterId,
        ]
      );

      companyId = companyResult.insertId;
    } else {
      companyId = existingCompanies[0].id;
    }

    // =================================================
    // DUPLICATE JOB CHECK
    // =================================================
    //
    // Same recruiter + same company + same title +
    // same location + same job type + same salary
    //
    // If it already exists, DON'T INSERT again.
    // =================================================

    const [existingJobs] = await db.execute(
      `
      SELECT id, status
      FROM jobs
      WHERE company_id = ?
      AND LOWER(TRIM(title)) = LOWER(?)
      AND LOWER(TRIM(location)) = LOWER(?)
      AND LOWER(TRIM(job_type)) = LOWER(?)
      AND LOWER(TRIM(salary)) = LOWER(?)
      LIMIT 1
      `,
      [
        companyId,
        jobTitle,
        jobLocation,
        jobType,
        jobSalary,
      ]
    );

    if (existingJobs.length > 0) {
      return res.status(409).json({
        message:
          "This job already exists. You cannot post the same job again.",
        jobId: existingJobs[0].id,
        status: existingJobs[0].status,
      });
    }

    // =================================================
    // CREATE JOB
    // =================================================

    const [result] = await db.execute(
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
        jobTitle,
        jobDescription,
        jobLocation,
        jobType,
        jobSalary,
        jobSkills,
        formattedDeadline,
        "pending",
      ]
    );

    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------
    return res.status(201).json({
      message: "Job posted successfully",
      jobId: result.insertId,
      companyId,
      status: "pending",
    });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createJob,
};