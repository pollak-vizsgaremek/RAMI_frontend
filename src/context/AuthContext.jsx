// context/AuthContext.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "../hooks/useAuth.js";
import { getStoredUser, getToken } from "../services/storage/storageService.js";
import { logout as logoutService } from "../services/api/authService.js";

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wrap your App (or main.jsx) with <AuthProvider> so every component
// can call useAuth() to read or update the logged-in state.

export function AuthProvider({ children }) {
  // Seed from localStorage so a page refresh doesn't log the user out
  const storedUser = getStoredUser();
  const [user, setUser] = useState(storedUser);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!getToken() && !!storedUser,
  );

  // Listen for the forced-logout event fired by authService's interceptor
  // when the refresh token has expired and the user must log in again.
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  // Called by Login.jsx and Register.jsx after a successful response:
  //   const data = await login(...);
  //   loginSuccess(data.user);
  const loginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Check if user has admin (creator) role
  const isAdmin = () => user?.role === "creator";

  // Check if user is an instructor
  const isInstructor = () => user?.role === "instructor";

  // Check if user is a student
  const isStudent = () => user?.role === "student" || !user?.role;

  // Called wherever you need to log out (navbar, settings, etc.)
  const logout = async () => {
    await logoutService();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loginSuccess,
        logout,
        isAdmin,
        isInstructor,
        isStudent,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
