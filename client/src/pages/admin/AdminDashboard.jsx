import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const cards = [
  ["👥","Total Users","total_users"],
  ["🎓","Job Seekers","total_jobseekers"],
  ["🏢","Recruiters","total_recruiters"],
  ["💼","Total Jobs","total_jobs"],
  ["⏳","Pending Jobs","pending_jobs"],
  ["✅","Approved Jobs","approved_jobs"],
  ["📝","Applications","total_applications"]
];

export default function AdminDashboard() {
  const [stats,setStats] = useState({});
  const [error,setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <Navbar />
      <main className="dashboard-shell">
        <div className="dashboard-heading">
          <div><div className="eyebrow">ADMIN CONTROL CENTER</div><h1>Dashboard</h1><p>Monitor the entire hiring ecosystem.</p></div>
          <button className="secondary-btn" onClick={load}>↻ Refresh</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="stat-grid">
          {cards.map(([icon,title,key]) => (
            <div className="stat-card" key={key}>
              <div className="stat-icon">{icon}</div>
              <div><span>{title}</span><strong>{stats[key] ?? 0}</strong></div>
            </div>
          ))}
        </div>

        <div className="action-grid">
          <Link to="/admin/jobs" className="action-card"><span>🛡️</span><div><h3>Review Jobs</h3><p>Approve or reject recruiter submissions.</p></div></Link>
          <Link to="/admin/users" className="action-card"><span>👥</span><div><h3>Manage Users</h3><p>View every registered account.</p></div></Link>
          <Link to="/jobs" className="action-card"><span>🔎</span><div><h3>Public Jobs</h3><p>Preview the live job marketplace.</p></div></Link>
        </div>
      </main>
    </div>
  );
}
