import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const token =
    localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user");

  // No login
  if (!token || !storedUser) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user;

  try {

    user = JSON.parse(
      storedUser
    );

  } catch {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Role restriction
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "recruiter") {
      return (
        <Navigate
          to="/recruiter/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/jobseeker/dashboard"
        replace
      />
    );
  }


  return children;
}