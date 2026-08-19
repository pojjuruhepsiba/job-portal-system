import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function ManageJobs() {
  const [jobs,setJobs]=useState([]);
  const load=()=>api.get("/recruiter/jobs/mine").then(({data})=>setJobs(data.jobs||[]));
  useEffect(()=>{load()},[]);
  const remove=async id=>{if(confirm("Delete this job?")){await api.delete(`/recruiter/jobs/${id}`);load();}};
  return <div><Navbar/><main className="dashboard-shell"><div className="dashboard-heading"><div><div className="eyebrow">RECRUITER • JOBS</div><h1>Manage Jobs</h1></div></div>
    <div className="admin-list">{!jobs.length&&<div className="empty-state">No jobs posted yet.</div>}{jobs.map(j=><div className="admin-job-row" key={j.id}><div><span className={`status-pill ${j.status}`}>{j.status}</span><h3>{j.title}</h3><p>{j.company_name} · {j.location}</p></div><button className="reject-btn" onClick={()=>remove(j.id)}>Delete</button></div>)}</div>
  </main></div>;
}
