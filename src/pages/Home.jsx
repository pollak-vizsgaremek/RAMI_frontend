import React, { useState, Suspense, lazy } from "react";
import Navbar from "../components/Navbar.jsx";
import DiscoveryGrid from "../components/DiscoveryGrid.jsx";

const LoginPage = lazy(() => import("./Login.jsx"));
const RegisterPage = lazy(() => import("./Register.jsx"));

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <main>
        <DiscoveryGrid />
      </main>

      {/* Modals */}
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
      </Suspense>
    </>
  );
}
