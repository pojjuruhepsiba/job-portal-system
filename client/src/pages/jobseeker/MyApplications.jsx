import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function MyApplications() {
  const [apps,setApps] = useState([]);
  const [error,setError] = useState("");

  useEffect(()=>{
    api.get("/applications/my")
      .then(({data})=>setApps(data.applications || []))
      .catch(err=>setError(err.response?.data?.message || "Could not load applications"));
  },[]);

  return <div><Navbar /><main className="dashboard-shell">
    <div className="dashboard-heading"><div><div className="eyebrow">JOB SEEKER • TRACKING</div><h1>My Applications</h1><p>See where every application stands.</p></div></div>
    {error && <div className="form-error">{error}</div>}
    <div className="admin-list">
      {!apps.length && !error && <div className="empty-state"><h3>No applications yet</h3><Link to="/jobs" className="primary-btn">Explore Jobs</Link></div>}
      {apps.map(a=><div className="admin-job-row" key={a.application_id}><div><span className={`status-pill ${a.status}`}>{a.status}</span><h3>{a.title}</h3><p>{a.company_name} · {a.location}</p></div><strong>{new Date(a.applied_at).toLocaleDateString()}</strong></div>)}
    </div>
  </main></div>;
}
