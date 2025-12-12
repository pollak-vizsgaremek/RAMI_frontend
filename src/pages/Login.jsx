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

  const handleGoogleAuth = () => {
    const width = 500,
      height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      `${API_URL}/auth/google`,
      "google_login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== API_URL) return;
        if (event.data === "success") {
          popup.close();
          window.location.reload();
        }
      },
      { once: true }
    );
  };

  const LoginFunc = () => {
    axios
      .post(`${API_URL}/auth/login`, { email, password })
      .then((res) => console.log(res.data));
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[440px] bg-white rounded-32px p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Üdvözlünk újra!</h2>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all mb-6 active:scale-95">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="h-5 w-5"
            alt="Google"
          />
          Bejelentkezés Google-lel
        </button>

        <div className="relative flex items-center mb-6">
          <div className="grow border-t border-gray-100"></div>
          <span className="mx-4 text-xs font-bold text-gray-300 uppercase">
            vagy
          </span>
          <div className="grow border-t border-gray-100"></div>
        </div>

        <div className="space-y-5">
          {/* Email Mező */}
          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
              E-mail cím
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Jelszó Mező */}
          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
              Jelszó
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-yellow-600 transition-colors">
                {showPassword ? "ELREJT" : "MUTAT"}
              </button>
            </div>
          </div>

          <button
            disabled={!isFormValid}
            onClick={LoginFunc}
            className={`w-full rounded-xl py-4 font-bold text-white mt-4 transition-all transform active:scale-95 ${
              isFormValid
                ? "bg-black hover:bg-gray-800 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            Bejelentkezés
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Új vagy még?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-yellow-600 font-bold hover:underline">
              Regisztrálj itt
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
