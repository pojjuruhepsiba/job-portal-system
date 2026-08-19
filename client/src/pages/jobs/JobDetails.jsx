import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data)).catch(() => setJob(false));
  }, [id]);

  const apply = async () => {
  try {
    const { data } = await api.post("/applications", {
      job_id: Number(id),
      cover_letter: cover
    });

    setMessage(
      data.message || "Application submitted successfully"
    );

  } catch (err) {
    console.error("APPLY ERROR:", err);

    setMessage(
      err.response?.data?.message ||
      "Application failed"
    );
  }
};
  if (job === null) return <div className="empty-state">Loading...</div>;
  if (!job) return <div className="empty-state">Job not found.</div>;

  return (
    <div>
      <Navbar />
      <main className="page-shell">
        <Link to="/jobs" className="back-link">← Back to jobs</Link>

        <section className="details-card">
          <div className="details-main">
            <div className="company-icon big">{job.company_name?.charAt(0)}</div>
            <div>
              <div className="eyebrow">OPEN POSITION</div>
              <h1>{job.title}</h1>
              <p className="company-name">{job.company_name}</p>
            </div>
          </div>

          <div className="job-meta large">
            <span>📍 {job.location}</span>
            <span>💼 {job.job_type}</span>
            <span>💰 {job.salary || "Competitive"}</span>
          </div>

          <div className="details-grid">
            <div>
              <h2>About the role</h2>
              <p className="long-text">{job.description}</p>

              <h2>Skills</h2>
              <div className="skills">{(job.skills || "").split(",").map((s,i)=><span key={i}>{s.trim()}</span>)}</div>
            </div>

            <aside className="apply-panel">
              <h3>Ready to apply?</h3>
              {user?.role === "jobseeker" ? (
                <>
                  <textarea value={cover} onChange={(e)=>setCover(e.target.value)} placeholder="Short cover letter (optional)" />
                  <button className="primary-btn full" onClick={apply}>Apply Now →</button>
                </>
              ) : (
                <p>Login as a Job Seeker to apply for this opportunity.</p>
              )}
              {message && <div className="form-success">{message}</div>}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}