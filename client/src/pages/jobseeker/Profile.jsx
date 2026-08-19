import Navbar from "../../components/Navbar";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return <div><Navbar /><main className="dashboard-shell"><div className="profile-card">
    <div className="profile-avatar">{user.name?.charAt(0) || "U"}</div>
    <div><div className="eyebrow">MY PROFILE</div><h1>{user.name || "User"}</h1><p>{user.email}</p><p>{user.phone || "Phone not added"}</p><span className="role-pill jobseeker">JOB SEEKER</span></div>
  </div></main></div>;
}
