import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function PendingJobs() {
  const [jobs,setJobs] = useState([]);
  const [message,setMessage] = useState("");

  const load = async () => {
    const {data} = await api.get("/admin/jobs/pending");
    setJobs(data.jobs || []);
  };

  useEffect(()=>{ load(); },[]);

  const update = async (id,status) => {
    try {
      const {data} = await api.patch(`/admin/jobs/${id}/status`,{status});
      setMessage(data.message);
      load();
    } catch(err) { setMessage(err.response?.data?.message || "Update failed"); }
  };

  return (
    <div><Navbar /><main className="dashboard-shell">
      <div className="dashboard-heading"><div><div className="eyebrow">ADMIN • MODERATION</div><h1>Pending Jobs</h1><p>Review recruiter submissions before they go live.</p></div></div>
      {message && <div className="form-success">{message}</div>}
      <div className="admin-list">
        {!jobs.length && <div className="empty-state">No pending jobs 🎉</div>}
        {jobs.map(job=><div className="admin-job-row" key={job.id}>
          <div><span className="small-pill">{job.job_type}</span><h3>{job.title}</h3><p>{job.company_name} · {job.location}</p><p>{job.description}</p></div>
          <div className="row-actions"><button className="approve-btn" onClick={()=>update(job.id,"approved")}>Approve</button><button className="reject-btn" onClick={()=>update(job.id,"rejected")}>Reject</button></div>
        </div>)}
      </div>
    </main></div>
  );
}
