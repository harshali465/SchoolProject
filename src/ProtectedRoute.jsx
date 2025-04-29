import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const jwtToken = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("user");
  const location = useLocation();

  if (!jwtToken) {
    return <Navigate to="/" />;
  }

  // Restrict teachers from accessing student pages
  if (
    userType === "teacher" &&
    location.pathname.startsWith("/student-dashboard")
  ) {
    return <Navigate to="/teacher/behaviour/leaderboard" />;
  }

  // Restrict students from accessing teacher pages
  if (userType === "student" && location.pathname.startsWith("/teacher/")) {
    return <Navigate to="/student-dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
