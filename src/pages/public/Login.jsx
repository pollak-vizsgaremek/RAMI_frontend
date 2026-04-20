import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/images/RAMI_logo.png";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const isFormValid =
    email.trim() !== "" && email.includes("@") && password !== "";
  const API_URL = "http://localhost:3300";

  const LoginFunc = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      // Log this to see exactly what the backend returns
      console.log("Backend response data:", res.data);

      // Look for the user object (it might be nested inside res.data.user or res.data.data.user)
      const userData = res.data.user || res.data.data?.user || res.data;

      // Handle flexible response formats from backend
      const userId = userData.userId || userData.id || userData._id;
      const userName =
        userData.name || userData.userName || email.split("@")[0];
      const userEmail = userData.email || email;

      // Look for the token (might be nested inside res.data.data)
      const token =
        res.data.token ||
        res.data.accessToken ||
        res.data.data?.token ||
        res.data.data?.accessToken;

      if (!userId || !token) {
        console.error("Missing data. Full response was:", res.data);
        throw new Error(
          "Invalid response from server: Missing user ID or token",
        );
      }

      // Store to both sessionStorage (for Navbar) and localStorage (for AuthContext)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("userEmail", userEmail);

      // Store to localStorage for AuthContext to pick up
      localStorage.setItem("accessToken", token);
      const userRole = isAdminMode ? "creator" : res.data.role || "student";
      sessionStorage.setItem("userRole", userRole);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole,
        }),
      );

      // Értesítjük a Navbart, hogy változás történt!
      window.dispatchEvent(new Event("authChange"));
      toast.success(
        isAdminMode ? "Admin bejelentkezés sikeres!" : "Sikeres bejelentkezés!",
      );

      setTimeout(() => {
        setLoading(false);
        if (onClose) onClose();

        // Redirect to home page
        navigate("/");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);

      // Log the full error response for debugging
      if (error.response?.status === 401) {
        console.error("Authentication failed:", error.response.data);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Hiba történt a bejelentkezés során.";
      toast.error(errorMessage);
      // Ha hitelesítési hiba (például rossz jelszó), kérdezzük meg a felhasználót,
      // hogy szeretne-e jelszó-visszaállítást kérni.
      if (error.response?.status === 401) {
        const goToReset = window.confirm(
          "Bejelentkezés sikertelen. Elfelejtetted a jelszavad? Szeretnél jelszó-visszaállítást kérni?",
        );
        if (goToReset) {
          if (onClose) onClose();
          navigate("/forgot-password");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-110 ${isAdminMode ? "bg-linear-to-br from-slate-900 to-slate-800" : "bg-white"} rounded-[40px] p-8 shadow-2xl transition-all duration-500 ease-out transform ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
          <button
            type="button"
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
              !isAdminMode
                ? "bg-white text-black shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            Felhasználó
          </button>
          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
              isAdminMode
                ? "bg-[#F6C90E] text-black shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            <Shield size={16} />
            Admin
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-16 mb-2" />
          <h2
            className={`text-2xl font-black ${isAdminMode ? "text-white" : "text-gray-900"}`}>
            {isAdminMode ? "Admin Panel" : "Üdvözlünk újra!"}
          </h2>
          {isAdminMode && (
            <p className="text-sm text-gray-400 mt-2">
              Adminisztrátor bejelentkezés
            </p>
          )}
        </div>

        <form className="space-y-5" onSubmit={LoginFunc}>
          <div className="flex flex-col group">
            <label
              className={`text-xs font-bold ${isAdminMode ? "text-gray-400" : "text-gray-400"} uppercase mb-2 ml-1 transition-all group-focus-within:${isAdminMode ? "text-yellow-400" : "text-black"}`}>
              E-mail
            </label>
            <input
              type="email"
              className={`w-full border ${
                isAdminMode
                  ? "border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-[#F6C90E]/50 focus:border-[#F6C90E]"
                  : "border-gray-200 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500"
              } rounded-xl px-4 py-3.5 outline-none transition-all`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col group">
            <label
              className={`text-xs font-bold ${isAdminMode ? "text-gray-400" : "text-gray-400"} uppercase mb-2 ml-1 transition-all group-focus-within:${isAdminMode ? "text-yellow-400" : "text-black"}`}>
              Jelszó
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border ${
                  isAdminMode
                    ? "border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-[#F6C90E]/50 focus:border-[#F6C90E]"
                    : "border-gray-200 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500"
                } rounded-xl px-4 py-3.5 outline-none transition-all`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isAdminMode
                    ? "text-gray-500 hover:text-[#F6C90E]"
                    : "text-gray-400 hover:text-yellow-600"
                }`}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full rounded-xl py-4 font-bold transition-all transform active:scale-95 cursor-pointer ${
              isAdminMode
                ? isFormValid && !loading
                  ? "bg-[#F6C90E] text-black hover:bg-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                : isFormValid && !loading
                  ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Bejelentkezés...
              </span>
            ) : (
              "Bejelentkezés"
            )}
          </button>

          {!isAdminMode && (
            <>
              <div className="flex justify-between items-center text-xs mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    navigate("/forgot-password");
                  }}
                  className="text-yellow-600 font-bold hover:underline">
                  Elfelejtetted a jelszavad?
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Új vagy még?{" "}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-yellow-600 font-bold hover:underline cursor-pointer">
                  Regisztrálj itt
                </button>
              </p>
            </>
          )}

          {isAdminMode && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">
                💼 <strong>Adminisztrátor bejelentkezés:</strong> Csak a
                platform adminisztrátorai férhetnek hozzá. Ezt a funkciót a
                szuperfelhasználók tartják fenn.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
