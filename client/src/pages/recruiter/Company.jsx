import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function Company() {
  const [companies,setCompanies]=useState([]);
  const [form,setForm]=useState({company_name:"",description:"",website:"",location:""});
  const [message,setMessage]=useState("");

  const load=()=>api.get("/company/mine").then(({data})=>setCompanies(data.companies||[]));
  useEffect(()=>{load()},[]);

  const submit=async e=>{
    e.preventDefault();
    try { const {data}=await api.post("/company",form); setMessage(data.message); setForm({company_name:"",description:"",website:"",location:""}); load(); }
    catch(err){setMessage(err.response?.data?.message||"Failed");}
  };

  return <div><Navbar/><main className="dashboard-shell"><div className="dashboard-heading"><div><div className="eyebrow">RECRUITER • COMPANY</div><h1>Company Profile</h1></div></div>
    <div className="split-grid"><form className="panel" onSubmit={submit}><h2>Add Company</h2>{message&&<div className="form-success">{message}</div>}
      <label>Company Name</label><input value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} required/>
      <label>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      <label>Website</label><input value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/>
      <label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      <button className="primary-btn">Save Company</button>
    </form><div className="panel"><h2>Your Companies</h2>{companies.map(c=><div className="company-list" key={c.id}><strong>{c.company_name}</strong><span>{c.location}</span></div>)}{!companies.length&&<p>No company yet.</p>}</div></div>
  </main></div>;
}