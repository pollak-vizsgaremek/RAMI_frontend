// context/AuthContext.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "../hooks/useAuth";
import { getStoredUser, getToken } from "../services/storageService";
import { logout as logoutService } from "../services/authService";

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wrap your App (or main.jsx) with <AuthProvider> so every component
// can call useAuth() to read or update the logged-in state.

export function AuthProvider({ children }) {
  // Seed from localStorage so a page refresh doesn't log the user out
  const [user, setUser] = useState(getStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken() && !!getStoredUser());

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

  // Called wherever you need to log out (navbar, settings, etc.)
  const logout = async () => {
    await logoutService();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
