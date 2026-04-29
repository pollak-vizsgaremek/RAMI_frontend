import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/images/RAMI_logo.png";
import { Eye, EyeOff, Shield, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginMode, setLoginMode] = useState("user"); // "user" | "instructor" | "admin"
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
      // Determine which endpoint to use
      const endpoint = loginMode === "instructor"
        ? `${API_URL}/api/v1/auth/login-instructor`
        : `${API_URL}/api/v1/auth/login`;

      const res = await axios.post(endpoint, { email, password });

      console.log("Backend response data:", res.data);

      const userData = res.data.user || res.data.data?.user || res.data;

      const userId = userData.userId || userData.id || userData._id;
      const userName =
        userData.name || userData.userName || email.split("@")[0];
      const userEmail = userData.email || email;
      const userProfileImage = userData.profileImage || null;

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

      const actualRole = userData.role || res.data.role;

      // --- Security Check: Ensure non-admins cannot log in via the Admin panel ---
      if (loginMode === "admin") {
        if (actualRole !== "admin" && actualRole !== "creator") {
          throw new Error("Nincs jogosultságod adminisztrátorként belépni!");
        }
      }

      // Store to both sessionStorage (for Navbar) and localStorage (for AuthContext)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("userEmail", userEmail);
      if (userProfileImage) {
        sessionStorage.setItem("userProfileImage", userProfileImage);
      }

      // Determine role
      let userRole;
      if (loginMode === "admin") {
        userRole = actualRole || "creator";
      } else if (loginMode === "instructor") {
        userRole = "instructor";
      } else {
        userRole = actualRole || "student";
      }

      sessionStorage.setItem("userRole", userRole);

      // Store to localStorage for AuthContext to pick up
      localStorage.setItem("accessToken", token);
      const userObj = {
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
        profileImage: userProfileImage,
      };
      // If instructor, also store instructorId
      if (loginMode === "instructor") {
        userObj.instructorId = userId;
      }
      localStorage.setItem("user", JSON.stringify(userObj));

      // Értesítjük a Navbart, hogy változás történt!
      window.dispatchEvent(new Event("authChange"));

      const modeLabels = {
        user: "Sikeres bejelentkezés!",
        instructor: "Oktatói bejelentkezés sikeres!",
        admin: "Admin bejelentkezés sikeres!",
      };
      toast.success(modeLabels[loginMode]);

      setTimeout(() => {
        setLoading(false);
        if (onClose) onClose();
        navigate("/");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        console.error("Authentication failed:", error.response.data);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Hiba történt a bejelentkezés során.";
      toast.error(errorMessage);

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

  const isDark = loginMode === "admin" || loginMode === "instructor";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-110 ${
          loginMode === "admin"
            ? "bg-linear-to-br from-slate-900 to-slate-800"
            : loginMode === "instructor"
              ? "bg-linear-to-br from-[#1a2332] to-[#2a3a4a]"
              : "bg-white"
        } rounded-[40px] p-8 shadow-2xl transition-all duration-500 ease-out transform ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>

        {/* Mode Toggle — 3 tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-full">
          <button
            type="button"
            onClick={() => setLoginMode("user")}
            className={`flex-1 py-2 px-3 rounded-full font-semibold transition-all text-sm ${
              loginMode === "user"
                ? "bg-white text-black shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            Felhasználó
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("instructor")}
            className={`flex-1 py-2 px-3 rounded-full font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              loginMode === "instructor"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            <BookOpen size={14} />
            Oktató
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("admin")}
            className={`flex-1 py-2 px-3 rounded-full font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
              loginMode === "admin"
                ? "bg-[#F6C90E] text-black shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            <Shield size={14} />
            Admin
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-16 mb-2" />
          <h2
            className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
            {loginMode === "admin"
              ? "Admin Panel"
              : loginMode === "instructor"
                ? "Oktatói Belépés"
                : "Üdvözlünk újra!"}
          </h2>
          {loginMode !== "user" && (
            <p className="text-sm text-gray-400 mt-2">
              {loginMode === "admin"
                ? "Adminisztrátor bejelentkezés"
                : "Oktató bejelentkezés"}
            </p>
          )}
        </div>

        <form className="space-y-5" onSubmit={LoginFunc}>
          <div className="flex flex-col group">
            <label
              className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-400"} uppercase mb-2 ml-1`}>
              E-mail
            </label>
            <input
              type="email"
              className={`w-full border ${
                isDark
                  ? "border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-[#F6C90E]/50 focus:border-[#F6C90E]"
                  : "border-gray-200 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500"
              } rounded-xl px-4 py-3.5 outline-none transition-all`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col group">
            <label
              className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-400"} uppercase mb-2 ml-1`}>
              Jelszó
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border ${
                  isDark
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
                  isDark
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
              loginMode === "admin"
                ? isFormValid && !loading
                  ? "bg-[#F6C90E] text-black hover:bg-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
                : loginMode === "instructor"
                  ? isFormValid && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
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

          {(loginMode === "user" || loginMode === "instructor") && (
            <div className="flex justify-between items-center text-xs mt-4">
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  navigate("/forgot-password");
                }}
                className={`${isDark ? "text-blue-400" : "text-yellow-600"} font-bold hover:underline`}>
                Elfelejtetted a jelszavad?
              </button>
            </div>
          )}

          {loginMode === "user" && (
            <>
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

          {loginMode === "admin" && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">
                💼 <strong>Adminisztrátor bejelentkezés:</strong> Csak a
                platform adminisztrátorai férhetnek hozzá.
              </p>
            </div>
          )}

          {loginMode === "instructor" && (
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/30 rounded-lg">
              <p className="text-xs text-blue-300 font-medium">
                📚 <strong>Oktatói bejelentkezés:</strong> Használd az oktatói
                regisztrációnál megadott email címed és jelszavad.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
