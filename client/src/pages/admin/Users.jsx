import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function Users() {
  const [users,setUsers] = useState([]);

  useEffect(()=>{ api.get("/admin/users").then(({data})=>setUsers(data.users || [])); },[]);

  return (
    <div><Navbar /><main className="dashboard-shell">
      <div className="dashboard-heading"><div><div className="eyebrow">ADMIN • PEOPLE</div><h1>Users</h1><p>Registered users across CareerNest.</p></div></div>
      <div className="table-card">
        <div className="table-head"><span>Name</span><span>Email</span><span>Role</span><span>Joined</span></div>
        {users.map(u=><div className="table-row" key={u.id}><span>{u.name}</span><span>{u.email}</span><span className={`role-pill ${u.role}`}>{u.role}</span><span>{new Date(u.created_at).toLocaleDateString()}</span></div>)}
      </div>
    </main></div>
  );
}
