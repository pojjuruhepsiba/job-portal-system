import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function Applicants() {
  const [apps,setApps]=useState([]);
  const [message,setMessage]=useState("");
  const load=()=>api.get("/recruiter/applications").then(({data})=>setApps(data.applications||[]));
  useEffect(()=>{load()},[]);
  const update=async(id,status)=>{try{const {data}=await api.patch(`/recruiter/applications/${id}/status`,{status});setMessage(data.message);load();}catch(err){setMessage(err.response?.data?.message||"Failed");}};
  return <div><Navbar/><main className="dashboard-shell"><div className="dashboard-heading"><div><div className="eyebrow">RECRUITER • TALENT</div><h1>Applicants</h1><p>Review applications and move candidates through the pipeline.</p></div></div>{message&&<div className="form-success">{message}</div>}
    <div className="admin-list">{!apps.length&&<div className="empty-state">No applications yet.</div>}{apps.map(a=><div className="admin-job-row" key={a.application_id}><div><span className={`status-pill ${a.status}`}>{a.status}</span><h3>{a.applicant_name}</h3><p>{a.applicant_email} · Applied for <strong>{a.title}</strong></p><p>{a.cover_letter}</p></div><div className="row-actions"><button className="approve-btn" onClick={()=>update(a.application_id,"shortlisted")}>Shortlist</button><button className="select-btn" onClick={()=>update(a.application_id,"selected")}>Select</button><button className="reject-btn" onClick={()=>update(a.application_id,"rejected")}>Reject</button></div></div>)}</div>
  </main></div>;
}

