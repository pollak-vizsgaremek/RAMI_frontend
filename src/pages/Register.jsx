import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import logo from "../assets/images/RAMI_logo.png";

export default function Register({ onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // only true when every field has a non-empty value
  const isFormValid =
    username.trim() !== "" &&
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    email.includes("@") &&
    password !== "" &&
    password2 !== "";

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  function RegisterFunc() {
    if (!isFormValid) return;
    console.log("Register func!");

    axios
      .post(`${API_URL}/auth/register`, {
        username,
        fullName,
        email,
        password,
        password2,
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
            Create an Account
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
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>

          <div className="flex items-center gap-3 text-gray-400 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-sm">Or sign up with email</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-300 placeholder-gray-400 text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Fullname"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-300 placeholder-gray-400 text-gray-900"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-2">
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
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-300 placeholder-gray-400 text-gray-900"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={RegisterFunc}
            disabled={!isFormValid}
            className={`w-full rounded-full py-3 font-semibold transition-all duration-150 mb-4 ${
              isFormValid
                ? "bg-black text-white hover:opacity-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-disabled={!isFormValid}>
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMounted(false);
                setTimeout(() => onSwitchToLogin?.(), 180);
              }}
              className="ml-1 text-yellow-500 font-semibold hover:underline">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
