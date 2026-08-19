const db = require("../config/db");

// ==========================================
// CREATE COMPANY
// ==========================================
const createCompany = async (req, res) => {
  try {
    const {
      company_name,
      description,
      location,
      website,
    } = req.body;

    if (!company_name) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can create companies",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM companies WHERE recruiter_id = ?",
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "You already have a company",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO companies
      (company_name, description, location, website, recruiter_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        company_name,
        description || null,
        location || null,
        website || null,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Company created successfully",
      companyId: result.insertId,
    });

  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY COMPANY
// ==========================================
const getMyCompany = async (req, res) => {
  try {
    const [companies] = await db.query(
      `
      SELECT *
      FROM companies
      WHERE recruiter_id = ?
      `,
      [req.user.id]
    );

    res.json({
      company: companies.length > 0
        ? companies[0]
        : null,
    });

  } catch (error) {
    console.error("GET MY COMPANY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL COMPANIES
// ==========================================
const getAllCompanies = async (req, res) => {
  try {
    const [companies] = await db.query(
      `
      SELECT
        id,
        company_name,
        description,
        location,
        website,
        recruiter_id
      FROM companies
      ORDER BY company_name ASC
      `
    );

    res.json({
      count: companies.length,
      companies,
    });

  } catch (error) {
    console.error("GET COMPANIES ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createCompany,
  getMyCompany,
  getAllCompanies,
};