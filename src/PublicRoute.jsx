import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const jwtToken = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("user");

  // If the user is authenticated, redirect to the relevant dashboard based on user type
  if (jwtToken) {
    switch (userType) {
      case "teacher":
        return <Navigate to="/teacher/behaviour/leaderboard" />;
      case "student":
        return <Navigate to="/student-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }

  // If not authenticated, render the public content
  return <Outlet />;
};

export default PublicRoute;
