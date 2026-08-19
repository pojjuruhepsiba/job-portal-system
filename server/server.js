require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running",
    version: "1.0.0",
  });
});

// ===============================
// AUTH
// ===============================
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// ===============================
// PUBLIC JOBS
// ===============================
app.use(
  "/api/jobs",
  require("./routes/publicJobRoutes")
);

// ===============================
// COMPANY
// ===============================
app.use(
  "/api/company",
  require("./routes/companyRoutes")
);

// ===============================
// RECRUITER JOBS
// ===============================
app.use(
  "/api/recruiter/jobs",
  require("./routes/jobRoutes")
);

// ===============================
// JOB SEEKER APPLICATIONS
// ===============================
app.use(
  "/api/applications",
  require("./routes/applicationRoutes")
);

// ===============================
// RECRUITER APPLICATIONS
// ===============================
app.use(
  "/api/recruiter/applications",
  require("./routes/recruiterApplicationRoutes")
);

// ===============================
// ADMIN
// ===============================
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ===============================
// 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});