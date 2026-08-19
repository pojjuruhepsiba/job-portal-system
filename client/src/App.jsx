import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingJobs from "./pages/admin/PendingJobs";
import Users from "./pages/admin/Users";

import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import MyApplications from "./pages/jobseeker/MyApplications";
import Profile from "./pages/jobseeker/Profile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import Applicants from "./pages/recruiter/Applicants";
import Company from "./pages/recruiter/Company";
import ManageJobs from "./pages/recruiter/ManageJobs";
import PostJob from "./pages/recruiter/PostJob";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= HOME ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= JOBS ================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />


        {/* ================= JOB SEEKER ================= */}

        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobseeker/applications"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobseeker/profile"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ================= RECRUITER ================= */}

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applicants"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/company"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Company />
            </ProtectedRoute>
          }
        />

        {/* IMPORTANT:
            Create Job now opens PostJob.jsx
        */}
        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* Also keep /post-job working */}
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/manage-jobs"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <ManageJobs />
            </ProtectedRoute>
          }
        />


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}