import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/images/RAMI_logo.png";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";

const ResetPassword = ({ onClose, onSwitchToForgotPassword }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const isModal = !!onClose;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek");
      return;
    }

    if (password.length < 6) {
      setError("A jelszó legalább 6 karakterből kell, hogy álljon");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      toast.success("Jelszó sikeresen visszaállítva!");
      setTimeout(() => {
        if (isModal && onClose) {
          onClose?.();
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "A jelszó visszaállítása sikertelen. A link lejárt.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // If it's a modal, render modal UI
  if (isModal) {
    if (!token) {
      return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onSwitchToForgotPassword}
          />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">
                Érvénytelen link
              </h2>
              <p className="text-gray-600">
                A jelszó-visszaállítási link érvénytelen vagy lejárt. Kérjük,
                próbálj újra.
              </p>
              <button
                onClick={onSwitchToForgotPassword}
                className="w-full bg-[#F6C90E] text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition">
                Vissza az elfelejtetett jelszóhoz
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
          onClick={onClose}
        />
        <div
          className={`relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl transition-all duration-500 ease-out transform ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="RAMI logo" className="h-16 mb-2" />
            <h2 className="text-2xl font-black text-gray-900">
              Új jelszó létrehozása
            </h2>
          </div>

          {success ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <p className="text-gray-600">
                Jelszó sikeresen visszaállítva! Átirányítás a
                bejelentkezéshez...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="flex flex-col group">
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                  Új jelszó
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Új jelszó"
                    required
                    className="w-full border border-gray-200 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 rounded-xl pl-10 pr-10 py-3.5 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-yellow-600">
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col group">
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                  Jelszó megerősítése
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Jelszó megerősítése"
                    required
                    className="w-full border border-gray-200 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 rounded-xl pl-10 pr-10 py-3.5 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-yellow-600">
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-4 font-bold transition-all transform active:scale-95 cursor-pointer bg-black text-white hover:bg-gray-800 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Jelszó visszaállítása...
                  </span>
                ) : (
                  "Jelszó visszaállítása"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Vissza az elfelejtetett jelszóhoz?{" "}
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-yellow-600 font-bold hover:underline cursor-pointer">
                  Kattints ide
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // FULL PAGE RENDERING (when accessed via direct route)
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">
              Érvénytelen jelszó-visszaállítási link. Kérjük próbálj újra.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="inline-block bg-[#F6C90E] text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500 transition">
              Új link igénylése
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F6C90E] mb-2">RAMI</h1>
          <h2 className="text-2xl font-semibold text-white">
            Új jelszó létrehozása
          </h2>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {success ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <p className="text-center text-gray-300">
                Jelszó sikeresen visszaállítva! Átirányítás a
                bejelentkezéshez...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Új jelszó
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Adja meg az új jelszavát"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300">
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Jelszó megerősítése
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Jelszó megerősítése"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300">
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F6C90E] text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Jelszó visszaállítása..." : "Jelszó visszaállítása"}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-[#F6C90E] hover:underline text-sm cursor-pointer">
              Vissza a bejelentkezéshez
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
