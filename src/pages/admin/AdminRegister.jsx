import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-toastify";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registrationCode = searchParams.get("code");

  const [step, setStep] = useState("code-validation"); // code-validation, form, success
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [codeData, setCodeData] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: registrationCode || "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Validate registration code
  const validateCode = async () => {
    if (!formData.code.trim()) {
      toast.error("Kérlek add meg a regisztrációs kódot!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3300/api/v1/auth/admin/validate-code/${formData.code}`,
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Érvénytelen regisztrációs kód.");
        return;
      }

      const data = await response.json();
      setCodeData(data);
      setFormData((prev) => ({
        ...prev,
        email: data.email,
      }));
      setStep("form");
      toast.success("Regisztrációs kód érvénytelen. Regisztrálhatsz!");
    } catch (error) {
      console.error("Error validating code:", error);
      toast.error("Hiba a regisztrációs kód ellenőrzésekor.");
    } finally {
      setLoading(false);
    }
  };

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Kérlek add meg a nevedet!");
      return;
    }

    if (!formData.password) {
      toast.error("Kérlek add meg a jelszavad!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A jelszó legalább 6 karakter hosszú kell, hogy legyen!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("A jelszavak nem egyeznek!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3300/api/v1/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name,
          registrationCode: formData.code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Hiba az admin regisztrálása során.");
        return;
      }

      const data = await response.json();
      
      // Store token
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userRole", data.user.role);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setStep("success");
      toast.success("Admin fiók sikeresen létrehozva!");

      // Redirect after 2 seconds
      setTimeout(() => {
        if (data.user.role === "creator" || data.user.role === "admin" || data.user.role === "moderator") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (error) {
      console.error("Error registering admin:", error);
      toast.error("Hiba az admin regisztrálása során.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft size={20} />
          <span>Vissza</span>
        </button>

        {/* Main Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Admin Regisztráció</h1>
          </div>

          {/* Step 1: Code Validation */}
          {step === "code-validation" && (
            <div className="space-y-6">
              <p className="text-slate-300 text-center">
                Az adminisztrátor jelölt egy regisztrációs kódot kapott az adminisztrátortól. Add meg a kódot az első lépéshez.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Regisztrációs Kód
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Másolja be a regisztrációs kódot"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                />
              </div>

              <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-slate-300">
                    <strong>Fontos:</strong> A regisztrációs kód az adminisztrátortól kapható. A kód 24 óráig érvényes és csak egyszer használható fel.
                  </p>
                </div>
              </div>

              <button
                onClick={validateCode}
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ellenőrzés folyamatban..." : "Kód Ellenőrzése"}
              </button>
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === "form" && codeData && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Cím
                </label>
                <div className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  {formData.email}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ez az email előre meghatározott a kódhoz.
                </p>
              </div>

              {/* Role (Info) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Szerepkör
                </label>
                <div className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white flex items-center gap-2">
                  <Shield size={16} className="text-yellow-400" />
                  {codeData.role === "creator"
                    ? "Adminisztrátor (Creator)"
                    : codeData.role === "admin"
                      ? "Adminisztrátor"
                      : "Moderátor"}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Teljes Név
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Teljes neved"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Jelszó
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Jelszó (min. 6 karakter)"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Jelszó Megerősítése
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Jelszó megerősítése"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200">
                    Erős jelszó ajánlott. Tartalmazza a számokat és speciális karaktereket.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Regisztrálás folyamatban..." : "Admin Fiók Létrehozása"}
              </button>

              {/* Back to Code */}
              <button
                type="button"
                onClick={() => {
                  setStep("code-validation");
                  setCodeData(null);
                }}
                className="w-full text-slate-400 hover:text-slate-200 py-2 text-sm transition"
              >
                Vissza a kód beírásához
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-white">Gratulálunk!</h2>

              <p className="text-slate-300">
                Az admin fiók sikeresen létrehozva! Bejelentkezésed az admin panelra fog történni.
              </p>

              <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mt-6">
                <p className="text-sm text-slate-300">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  <strong>Szerepkör:</strong>{" "}
                  {codeData?.role === "creator"
                    ? "Adminisztrátor (Creator)"
                    : codeData?.role === "admin"
                      ? "Adminisztrátor"
                      : "Moderátor"}
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                Átirányítás az admin panelra... 2 másodperc múlva
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Nincs admin kódod?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            Vissza a főoldalra
          </button>
        </p>
      </div>
    </div>
  );
}
