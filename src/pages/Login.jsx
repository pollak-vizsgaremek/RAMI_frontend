import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/RAMI_logo.png";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const isFormValid =
    email.trim() !== "" && email.includes("@") && password !== "";
  //const API_URL = import.meta.env.API_URL;
  const API_URL = "http://localhost:3300";
  const LoginFunc = async () => {
    console.log({ API_URL, email, password });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      toast.success("Sikeres bejelentkezés!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Hiba történt a bejelentkezés során.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-110 bg-white rounded-[40px] p-8 shadow-2xl transition-all duration-500 ease-out transform ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Üdvözlünk újra!</h2>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all group-focus-within:text-black">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col group">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1 transition-all group-focus-within:text-black">
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
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              className="text-yellow-600 font-bold hover:underline cursor-pointer">
              Regisztrálj itt
            </button>
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
