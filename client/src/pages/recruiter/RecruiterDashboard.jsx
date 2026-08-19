import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return <div><Navbar /><main className="dashboard-shell">
    <div className="welcome-banner recruiter"><div><div className="eyebrow">RECRUITER STUDIO</div><h1>Build your hiring pipeline, {user.name || "Recruiter"}.</h1><p>Publish jobs, review candidates and manage your recruitment flow.</p></div><span className="welcome-icon">◆</span></div>
    <div className="action-grid">
      <Link to="/recruiter/create-job" className="action-card"><span>＋</span><div><h3>Post a Job</h3><p>Create an opportunity for candidates.</p></div></Link>
      <Link to="/recruiter/manage-jobs" className="action-card"><span>💼</span><div><h3>Manage Jobs</h3><p>Review your postings and statuses.</p></div></Link>
      <Link to="/recruiter/applicants" className="action-card"><span>👥</span><div><h3>Applicants</h3><p>Review candidates and update status.</p></div></Link>
      <Link to="/recruiter/company" className="action-card"><span>🏢</span><div><h3>Company</h3><p>Set up your company profile.</p></div></Link>
    </div>
  </main></div>;
}