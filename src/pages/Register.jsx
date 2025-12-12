import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Register({ onClose }) {
  const [surname, setSurname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isFormValid =
    surname.trim() !== "" &&
    lastname.trim() !== "" &&
    email.includes("@") &&
    password.length >= 12 &&
    password === password2;
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleAuth = () => {
    const width = 500,
      height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    window.open(
      `${API_URL}/auth/google`,
      "google_reg",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const RegisterFunc = () => {
    axios
      .post(`${API_URL}/auth/register`, { surname, lastname, email, password })
      .then((res) => console.log(res.data));
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[480px] bg-white rounded-[40px] p-10 shadow-2xl">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-6">
          Fiók létrehozása
        </h2>

        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all mb-6">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="h-5 w-5"
            alt="Google"
          />
          Regisztráció Google-lel
        </button>

        <div className="relative flex items-center mb-6">
          <div className="grow border-t border-gray-100"></div>
          <span className="mx-3 text-[10px] font-black text-gray-300 uppercase">
            vagy töltsd ki
          </span>
          <div className="grow border-t border-gray-100"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col group">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
                Vezetéknév
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="flex flex-col group">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
                Keresztnév
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
              E-mail
            </label>
            <input
              type="email"
              className="placeholder-gray-400 w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
              value={email}
              placeholder="pelda@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all duration-300 group-focus-within:text-black group-focus-within:translate-x-1">
              Jelszó
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="placeholder-gray-400 w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                {showPassword ? "ELREJT" : "MUTAT"}
              </button>
            </div>
          </div>

          <button
            onClick={RegisterFunc}
            disabled={!isFormValid}
            className={`w-full rounded-full py-4 font-bold transition-all transform active:scale-95 ${
              isFormValid
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            Regisztráció
          </button>
        </div>
      </div>
    </div>
  );
}
