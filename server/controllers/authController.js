const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Allowed roles
    const allowedRoles = [
      "admin",
      "jobseeker",
      "recruiter"
    ];

    // Default role
    const userRole = role || "jobseeker";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // Check existing email
    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role,
        phone
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        userRole,
        phone || null
      ]
    );

    return res.status(201).json({
      message: "Registration successful",
      userId: result.insertId,
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
        role: userRole
      }
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    console.log("LOGIN EMAIL:", cleanEmail);

    // =================================================
    // FIND USER
    // =================================================

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role,
        phone
      FROM users
      WHERE LOWER(email) = ?
      LIMIT 1
      `,
      [cleanEmail]
    );

    console.log("USER FOUND:", users.length);

    // No user
    if (users.length === 0) {
      return res.status(401).json({
        message: "Account not found. Please register first."
      });
    }

    const user = users[0];

    // =================================================
    // PASSWORD CHECK
    // =================================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    // =================================================
    // JWT
    // =================================================

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }

    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};


module.exports = {
  register,
  login
};