import React, { useState, useEffect, Suspense, lazy } from "react";
import { Outlet } from "react-router-dom"; // Use react-router-dom for web
import Navbar from "./Navbar.jsx"; // Import the Navbar we built
import axios from "axios";
import { toast } from "react-toastify";

// Lazy load your modals so they don't slow down the initial page load
const LoginPage = lazy(() => import("../../pages/public/Login.jsx"));
const RegisterPage = lazy(() => import("../../pages/public/Register.jsx"));
const ResetPasswordPage = lazy(
  () => import("../../pages/public/ResetPassword.jsx"),
);

export default function Layout() {
  // --- 1. Search Bar State ---
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // --- 2. Authentication Modal State ---
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // --- 3. The Backend Search Logic ---
  useEffect(() => {
    // If the user hasn't typed at least 2 characters, clear the results and don't search
    if (searchValue.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const fetchInstructors = async () => {
      setIsSearching(true);
      setSearchError(null); // Reset errors before trying

      try {
        const res = await axios.get(
          `http://localhost:3300/api/v1/instructor/search?q=${searchValue}`,
        );
        setSearchResults(res.data);
      } catch (error) {
        console.error("Hiba a kereséskor:", error);
        const errMsg =
          error.response?.data?.error ||
          "Szerver hiba történt a keresés során.";
        setSearchError(errMsg);
        toast.error("Hiba a keresés során: " + errMsg);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce: Wait 300ms after the user stops typing to avoid spamming the database
    const timeoutId = setTimeout(() => {
      fetchInstructors();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  return (
    <div className="min-h-screen bg-gray-800 bg-linear-to-br from-gray-900 via-gray-500 to-gray-300">
      {/* --- THE NAVBAR --- */}
      {/* We pass all the state and modal triggers down to the Navbar */}
      <Navbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchResults={searchResults}
        isSearching={isSearching}
        searchError={searchError}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      {/* --- THE PAGE CONTENT --- */}
      {/* This renders whatever page the user is currently on (Home, Profile, etc.) */}
      <Suspense
        fallback={
          <div className="p-20 text-center text-[#F6C90E] font-bold">
            Betöltés...
          </div>
        }>
        <Outlet />
      </Suspense>

      {/* --- THE GLOBAL MODALS --- */}
      {/* Now your login/register popups will work on every single page! */}
      <Suspense fallback={null}>
        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <RegisterPage
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
        {showResetPassword && (
          <ResetPasswordPage
            onClose={() => setShowResetPassword(false)}
            onSwitchToForgotPassword={() => {
              setShowResetPassword(false);
              // You can navigate to forgot password or just close the modal
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
