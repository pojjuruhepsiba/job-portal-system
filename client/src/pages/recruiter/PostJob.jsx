import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    title: "",
    job_type: "Full-Time",
    location: "",
    salary: "",
    skills: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DD-MM-YYYY -> YYYY-MM-DD
  const convertDate = (dateString) => {
    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const [day, month, year] = parts;

    if (
      day.length !== 2 ||
      month.length !== 2 ||
      year.length !== 4
    ) {
      return null;
    }

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    // Validate actual date
    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.company_name ||
      !form.title ||
      !form.location ||
      !form.salary ||
      !form.skills ||
      !form.deadline ||
      !form.description
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const formattedDeadline = convertDate(form.deadline);

    if (!formattedDeadline) {
      setError(
        "Please enter a valid deadline in DD-MM-YYYY format."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/recruiter/jobs", {
        company_name: form.company_name,
        title: form.title,
        job_type: form.job_type,
        location: form.location,
        salary: form.salary,
        skills: form.skills,
        deadline: formattedDeadline,
        description: form.description,
      });

      setSuccess(
        response.data?.message ||
          "Job posted successfully!"
      );

      setForm({
        company_name: "",
        title: "",
        job_type: "Full-Time",
        location: "",
        salary: "",
        skills: "",
        deadline: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1200);
    } catch (err) {
      console.error("POST JOB ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to post job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">

        {/* HEADER */}
        <div className="post-job-header">
          <div>
            <span className="page-badge">
              RECRUITER
            </span>

            <h1>Post a New Job</h1>

            <p>
              Find the right candidate for your team.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/recruiter/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {/* FORM CARD */}
        <div className="post-job-card">

          {error && (
            <div className="post-alert error">
              {error}
            </div>
          )}

          {success && (
            <div className="post-alert success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* COMPANY + JOB TYPE */}
            <div className="form-row">

              <div className="form-field">
                <label>
                  Company Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  
                />

                <small>
                  Enter any company name you want.
                </small>
              </div>

              <div className="form-field">
                <label>
                  Job Type
                  <span>*</span>
                </label>

                <select
                  name="job_type"
                  value={form.job_type}
                  onChange={handleChange}
                >
                  <option value="Full-Time">
                    Full-Time
                  </option>

                  <option value="Part-Time">
                    Part-Time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>
              </div>

            </div>

            {/* TITLE */}
            <div className="form-field">
              <label>
                Job Title
                <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. React Frontend Developer"
              />
            </div>

            {/* LOCATION + SALARY */}
            <div className="form-row">

              <div className="form-field">
                <label>
                  Location
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Vijayawada"
                />
              </div>

              <div className="form-field">
                <label>
                  Salary
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 6-10 LPA"
                />
              </div>

            </div>

            {/* SKILLS + DEADLINE */}
            <div className="form-row">

              <div className="form-field">
                <label>
                  Skills
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, MySQL, Bootstrap"
                />

                <small>
                  Separate skills using commas.
                </small>
              </div>

              <div className="form-field">
                <label>
                  Application Deadline
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                  maxLength="10"
                  inputMode="numeric"
                />

                <small>
                  Example: 25-10-2026
                </small>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="form-field">
              <label>
                Job Description
                <span>*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, requirements and qualifications..."
                rows="7"
              />
            </div>

            {/* BUTTONS */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/recruiter/dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="publish-button"
                disabled={loading}
              >
                {loading
                  ? "Publishing..."
                  : "🚀 Publish Job"}
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}