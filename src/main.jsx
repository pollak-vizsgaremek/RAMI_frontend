import { lazy, StrictMode, useState, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar.jsx";
import DiscoveryGrid from "./components/DiscoveryGrid.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const LoginPage = lazy(() => import("./pages/Login.jsx"));
const RegisterPage = lazy(() => import("./pages/Register.jsx"));

function LayoutWithModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-800 bg-linear-to-br from-gray-900 via-gray-500 to-gray-300">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <main>
        <DiscoveryGrid />
        <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
          <HomePage />
        </Suspense>
      </main>

      {/* Modals */}
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
    </div>
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
