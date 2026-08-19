import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {

      setError(
        "Please enter email and password."
      );

      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email: form.email.trim(),
          password: form.password
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      const {
        token,
        user
      } = response.data;

      if (!token || !user) {

        setError(
          "Invalid server response."
        );

        return;
      }

      // Save login data
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // =================================================
      // ROLE BASED REDIRECT
      // =================================================

      if (user.role === "admin") {

        navigate("/admin/dashboard");

      } else if (user.role === "recruiter") {

        navigate("/recruiter/dashboard");

      } else {

        navigate("/jobseeker/dashboard");
      }

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon">
            💼
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your Job Portal account
          </p>

        </div>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login →"}

          </button>

        </form>


        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}