import { lazy, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const LoginPage = lazy(() => import("./pages/Login.jsx"));
const RegisterPage = lazy(() => import("./pages/Register.jsx"));

function LayoutWithModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <HomePage />
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
    </>
  );
}

export default LayoutWithModals;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LayoutWithModals />
    </BrowserRouter>
  </StrictMode>
);
