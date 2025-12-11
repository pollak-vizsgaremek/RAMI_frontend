import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/RAMI_logo.png";

export default function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isFormValid =
    email.trim() !== "" && email.includes("@") && password !== "";

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  function LoginFunc() {
    console.log("Login func!");

    axios
      .post(`${API_URL}/auth/login`, {
        email,
        password,
      })
      .then(async (res) => {
        console.log(await res.data);
      });
  }

  function handleGoogleAuth() {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const popup = window.open(
      `${API_URL}/auth/google`,
      "google_oauth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    function listener(e) {
      try {
        const origin = new URL(API_URL).origin;
        if (e.origin !== origin) return;
      } catch {
        // ignore
      }

      if (e.data && e.data.type === "oauth" && e.data.provider === "google") {
        window.removeEventListener("message", listener);
        if (popup) popup.close();
        window.location.reload();
      }
    }

    window.addEventListener("message", listener);
  }

  function handleClose() {
    setMounted(false);
    setTimeout(() => onClose?.(), 180);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${
        mounted ? "opacity-100" : "opacity-0"
      }`}>
      <div
        className={`bg-white w-full max-w-lg mx-4 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-180 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <img src={logo} alt="RAMI logo" className="h-8" />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Login
          </h2>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 border rounded-full hover:shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M44 20H24v8h11.9C34.7 30.9 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 2.9l5.6-5.6C35 6.6 29.8 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium">Login with Google</span>
          </button>

          <div className="flex items-center gap-3 text-gray-400 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-sm">Or login with email</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-300 placeholder-gray-400 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-orange-300 placeholder-gray-400 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 12s4-8 9-8 9 8 9 8-4 8-9 8-9-8-9-8z"
                    stroke="#374151"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="#374151"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-4-9-8 0-1.08.2-2.12.56-3.06M1 1l22 22"
                    stroke="#374151"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-yellow-500 font-medium hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={LoginFunc}
            className={`w-full rounded-full py-3 font-semibold text-white transition-all duration-150 ${
              isFormValid
                ? "bg-black hover:opacity-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}>
            Continue
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="ml-1 text-yellow-500 font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
