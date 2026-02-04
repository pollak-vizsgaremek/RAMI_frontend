import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/RAMI_logo.png";
import { Eye, EyeOff } from "lucide-react";

export default function Register({ onClose, onSwitchToLogin }) {
  const [surname, setSurname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const isFormValid =
    surname.trim() !== "" &&
    lastname.trim() !== "" &&
    email.includes("@") &&
    password.length >= 8 &&
    password === password2;

  const API_URL = import.meta.env.DATABASE_URL;

  const RegisterFunc = () => {
    axios
      .post(`${API_URL}/auth/register`, { surname, lastname, email, password })
      .then((res) => console.log(res.data));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-[480px] bg-white rounded-[40px] p-8 shadow-2xl transition-all duration-500 ease-out transform ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-14 mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Regisztráció</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Vezetéknév
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Keresztnév
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col group relative">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col group relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Jelszó
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col group relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Megerősítés
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-yellow-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={RegisterFunc}
            disabled={!isFormValid}
            className={`w-full rounded-xl py-4 font-bold transition-all transform active:scale-95 mt-2 ${
              isFormValid
                ? "bg-black text-white shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            Regisztráció
          </button>

          <p className="text-center text-sm text-gray-500">
            Van már fiókod?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-yellow-600 font-bold hover:underline">
              Jelentkezz be
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
