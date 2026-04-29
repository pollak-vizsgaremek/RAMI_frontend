// context/AuthContext.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "../hooks/useAuth.js";
import { getStoredUser, getToken } from "../services/storage/storageService.js";
import { logout as logoutService } from "../services/api/authService.js";

export function AuthProvider({ children }) {
  const storedUser = getStoredUser();
  const [user, setUser] = useState(storedUser);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!getToken() && !!storedUser,
  );

  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
    };
    window.addEventListener("auth:logout", handleForcedLogout);

    const handleAuthChange = () => {
      const updatedUser = getStoredUser();
      const token = getToken();
      if (updatedUser && token) {
        setUser(updatedUser);
        setIsLoggedIn(true);
      }
    };
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const loginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const isAdmin = () => user?.role === "creator" || user?.role === "admin";
  const isInstructor = () => user?.role === "instructor";
  const isStudent = () => user?.role === "student" || !user?.role;

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
