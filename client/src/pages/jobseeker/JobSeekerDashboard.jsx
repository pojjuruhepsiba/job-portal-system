import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function JobSeekerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return <div><Navbar /><main className="dashboard-shell">
    <div className="welcome-banner"><div><div className="eyebrow">JOB SEEKER SPACE</div><h1>Welcome, {user.name || "Job Seeker"}.</h1><p>Keep exploring. Your next opportunity could be one click away.</p></div><span className="welcome-icon">✦</span></div>
    <div className="action-grid">
      <Link to="/jobs" className="action-card"><span>🔎</span><div><h3>Browse Jobs</h3><p>Explore approved opportunities.</p></div></Link>
      <Link to="/jobseeker/applications" className="action-card"><span>📝</span><div><h3>My Applications</h3><p>Track your hiring journey.</p></div></Link>
      <Link to="/jobseeker/profile" className="action-card"><span>👤</span><div><h3>My Profile</h3><p>Keep your information ready.</p></div></Link>
    </div>
  </main></div>;
}