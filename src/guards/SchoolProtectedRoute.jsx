import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * SchoolProtectedRoute - Protects school admin pages
 * Only allows users with 'school' role to access
 */
const SchoolProtectedRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "school") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Hozzáférés Megtagadva
          </h1>
          <p className="text-gray-600">
            Nincs jogosultságod ennek az oldalnak a megtekintéséhez.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Csak az autósiskolák regisztrált adminisztrátorai férhetnek hozzá ehhez a felülethez.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default SchoolProtectedRoute;
