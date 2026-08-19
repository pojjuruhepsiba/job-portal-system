import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const dashboardPath = user?.role === "admin"
    ? "/admin/dashboard"
    : user?.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/jobseeker/dashboard";

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Career<span>Nest</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>

        {user ? (
          <>
            <Link to={dashboardPath}>Dashboard</Link>
            <button className="nav-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="nav-cta" to="/register">Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
}
