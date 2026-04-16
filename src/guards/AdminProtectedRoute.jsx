import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * AdminProtectedRoute - Protects admin-only pages
 * Only allows users with 'creator' role to access admin pages
 */
const AdminProtectedRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "creator") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Only administrators can access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
