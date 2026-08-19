import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    company_id: "",
    title: "",
    location: "",
    job_type: "Full-Time",
    salary: "",
    skills: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD COMPANIES
  // ==========================================
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setCompanyLoading(true);

        const response = await api.get("/company");

        console.log("COMPANIES:", response.data);

        setCompanies(response.data.companies || []);

      } catch (error) {
        console.error("COMPANY LOAD ERROR:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load companies"
        );
      } finally {
        setCompanyLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE JOB
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.company_id) {
      setError("Please select a company.");
      return;
    }

    if (!form.title) {
      setError("Please enter job title.");
      return;
    }

    if (!form.location) {
      setError("Please enter location.");
      return;
    }

    if (!form.description) {
      setError("Please enter job description.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/recruiter/jobs",
        {
          company_id: Number(form.company_id),
          title: form.title,
          location: form.location,
          job_type: form.job_type,
          salary: form.salary,
          skills: form.skills,
          deadline: form.deadline,
          description: form.description,
        }
      );

      setSuccess(
        response.data?.message ||
        "Job created successfully!"
      );

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1200);

    } catch (error) {
      console.error("CREATE JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">

      <div className="create-job-container">

        <div className="create-job-header">
          <h1>Create New Job</h1>

          <p>
            Publish an opportunity and connect with talented candidates.
          </p>
        </div>

        {error && (
          <div className="form-alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-alert success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* COMPANY + JOB TYPE */}

          <div className="form-grid">

            <div className="form-group">
              <label>
                Company
              </label>

              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                disabled={companyLoading}
              >
                <option value="">
                  {companyLoading
                    ? "Loading companies..."
                    : "Select company"}
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.company_name}
                  </option>
                ))}
              </select>

              {!companyLoading &&
                companies.length === 0 && (
                  <small className="field-help">
                    No company found. Please create a company first.
                  </small>
                )}
            </div>

            <div className="form-group">
              <label>
                Job Type
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
              </select>
            </div>

          </div>

          {/* TITLE */}

          <div className="form-group">
            <label>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="e.g. React Frontend Developer"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* LOCATION + SALARY */}

          <div className="form-grid">

            <div className="form-group">
              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Vijayawada"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Salary
              </label>

              <input
                type="text"
                name="salary"
                placeholder="e.g. 6-10 LPA"
                value={form.salary}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* SKILLS + DEADLINE */}

          <div className="form-grid">

            <div className="form-group">
              <label>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                placeholder="React, JavaScript, MySQL, Bootstrap"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="8"
              placeholder="Describe the role, responsibilities and requirements..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* BUTTON */}

          <div className="create-job-actions">

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
              className="create-job-button"
              disabled={
                loading ||
                companyLoading ||
                companies.length === 0
              }
            >
              {loading
                ? "Publishing..."
                : "Publish Job"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}