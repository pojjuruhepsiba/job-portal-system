import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-icon">{job.company_name?.charAt(0) || "C"}</div>
        <div>
          <h3>{job.title}</h3>
          <p>{job.company_name}</p>
        </div>
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>💼 {job.job_type}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>

      <div className="skills">
        {(job.skills || "").split(",").slice(0, 4).map((skill, index) => (
          <span key={index}>{skill.trim()}</span>
        ))}
      </div>

      <p className="job-description">
        {(job.description || "").slice(0, 125)}
        {job.description?.length > 125 ? "..." : ""}
      </p>

      <Link className="view-job-btn" to={`/jobs/${job.id}`}>
        View Opportunity →
      </Link>
    </article>
  );
}