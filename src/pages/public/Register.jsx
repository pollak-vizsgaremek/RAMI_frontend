import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import logo from "../../assets/images/RAMI_logo.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwam.com",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "guerrillamail.info",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "spam4.me",
  "trashmail.com",
  "trashmail.me",
  "trashmail.at",
  "trashmail.io",
  "fakeinbox.com",
  "dispostable.com",
  "mailnull.com",
  "spamgourmet.com",
  "spamgourmet.net",
  "maildrop.cc",
  "discard.email",
  "tempr.email",
  "burnermail.io",
  "tempinbox.com",
  "getairmail.com",
  "filzmail.com",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "33mail.com",
  "anonaddy.com",
  "spamherelots.com",
  "spamhere.eu",
  "jetable.fr.nf",
]);

const DOMAIN_TYPOS = {
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "outloo.com": "outlook.com",
};

function useEmailValidation() {
  const [emailStatus, setEmailStatus] = useState("idle");
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const debounceRef = useRef(null);

  const validateEmail = (email) => {
    clearTimeout(debounceRef.current);
    setEmailSuggestion("");
    setEmailError("");

    if (!email || !email.includes("@") || !email.includes(".")) {
      setEmailStatus("idle");
      return;
    }

    const parts = email.split("@");
    if (parts.length !== 2 || !parts[1]) {
      setEmailStatus("idle");
      return;
    }

    const domain = parts[1].toLowerCase();

    if (DOMAIN_TYPOS[domain]) {
      setEmailSuggestion(`${parts[0]}@${DOMAIN_TYPOS[domain]}`);
      setEmailStatus("warning");
      setEmailError("Úgy tűnik, elgépelted a domaint. Erre gondoltál?");
      return;
    }

    if (DISPOSABLE_DOMAINS.has(domain)) {
      setEmailStatus("invalid");
      setEmailError("Ideiglenes e-mail cím nem elfogadott.");
      return;
    }

    setEmailStatus("checking");

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.disify.com/api/email/${encodeURIComponent(email)}`,
        );
        if (!res.ok) {
          setEmailStatus("valid");
          return;
        }
        const data = await res.json();

        if (!data.format) {
          setEmailStatus("invalid");
          setEmailError("Érvénytelen formátum.");
        } else if (data.disposable) {
          setEmailStatus("invalid");
          setEmailError("Ideiglenes e-mail.");
        } else if (!data.dns) {
          setEmailStatus("invalid");
          setEmailError("Ez a domain nem létezik.");
        } else {
          setEmailStatus("valid");
          setEmailError("");
        }
      } catch {
        setEmailStatus("valid");
        setEmailError("");
      }
    }, 700);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return {
    emailStatus,
    emailError,
    emailSuggestion,
    validateEmail,
    setEmailStatus,
    setEmailSuggestion,
    setEmailError,
  };
}

export default function Register({ onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    emailStatus,
    emailError,
    emailSuggestion,
    validateEmail,
    setEmailSuggestion,
  } = useEmailValidation();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const isEmailOk = emailStatus === "valid" || emailStatus === "warning";
  const isFormValid =
    name.trim() !== "" &&
    isEmailOk &&
    password.length >= 8 &&
    password === password2;

  const RegisterFunc = async (e) => {
    e.preventDefault(); // Megakadályozza a form alapértelmezett újratöltését
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:3300/api/v1/auth/register`, {
        name,
        email,
        password,
      });
      toast.success(
        "Sikeres regisztráció! Kérlek, erősítsd meg az e-mail címedet a kiküldött linken keresztül.",
      );
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Hiba történt a regisztráció során.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailBorderClass =
    emailStatus === "valid"
      ? "border-green-400 focus:border-green-500 focus:ring-green-100"
      : emailStatus === "invalid"
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : emailStatus === "warning"
          ? "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-100"
          : "border-gray-200 focus:border-yellow-500 focus:ring-yellow-100";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-[480px] bg-white rounded-[40px] p-8 shadow-2xl transition-all duration-500 transform ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="RAMI logo" className="h-14 mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Regisztráció</h2>
        </div>

        {/* Form a gombok enterrel történő beküldéséhez */}
        <form className="space-y-4" onSubmit={RegisterFunc}>
          <div className="flex flex-col group">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
              Teljes név
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-yellow-100 focus:border-yellow-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col group relative">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                className={`w-full border rounded-xl px-4 py-2.5 focus:ring-2 outline-none transition-all pr-10 ${emailBorderClass}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {emailStatus === "checking" && (
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                )}
                {emailStatus === "valid" && (
                  <span className="text-green-500 text-sm font-bold">✓</span>
                )}
                {emailStatus === "invalid" && (
                  <span className="text-red-500 text-sm font-bold">✗</span>
                )}
                {emailStatus === "warning" && (
                  <span className="text-yellow-500 text-sm font-bold">?</span>
                )}
              </div>
            </div>
            {emailError && emailStatus !== "warning" && (
              <p className="text-xs text-red-500 mt-1 ml-1">{emailError}</p>
            )}
            {emailSuggestion && (
              <p className="text-xs text-yellow-700 mt-1 ml-1">
                Erre gondoltál?{" "}
                <button
                  type="button"
                  className="font-bold underline cursor-pointer"
                  onClick={() => {
                    setEmail(emailSuggestion);
                    validateEmail(emailSuggestion);
                    setEmailSuggestion("");
                  }}>
                  {emailSuggestion}
                </button>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col group relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Jelszó
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border rounded-xl px-4 py-2.5 focus:ring-2 outline-none transition-all ${password.length > 0 && password.length < 8 ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-yellow-500"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* ÚJ: Jelszó karakter számláló */}
              {password.length > 0 && (
                <div className="mt-1 ml-1">
                  {password.length < 8 ? (
                    <span className="text-[10px] font-bold text-red-500">
                      Min. 8 karakter ({password.length}/8)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-green-500">
                      Megfelelő hosszúság ✓
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col group relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 group-focus-within:text-black">
                Megerősítés
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border rounded-xl px-4 py-2.5 focus:ring-2 outline-none transition-all pr-10 ${password2.length > 0 ? (password === password2 ? "border-green-400 focus:border-green-500 focus:ring-green-100" : "border-red-400 focus:border-red-500 focus:ring-red-100") : "border-gray-200 focus:border-yellow-500"}`}
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

          {password2.length > 0 && password !== password2 && (
            <p className="text-xs text-red-500 -mt-2 ml-1">
              A két jelszó nem egyezik.
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full rounded-xl py-4 font-bold text-white mt-4 transition-all transform active:scale-95 cursor-pointer ${isFormValid && !isSubmitting ? "bg-black hover:bg-gray-800 shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            {isSubmitting ? "Kérlek várj..." : "Regisztráció"}
          </button>

          <div className="flex flex-col items-center space-y-2 mt-3">
            <p className="text-center text-sm text-gray-500">
              Van már fiókod?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-yellow-600 font-bold hover:underline cursor-pointer">
                Jelentkezz be
              </button>
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  navigate("/register-instructor");
                }}
                className="text-sm text-[#F6C90E] font-semibold hover:underline">
                Oktatóként szeretnék jelentkezni
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  navigate("/register-school");
                }}
                className="text-sm text-[#F6C90E] font-semibold hover:underline">
                Iskola regisztráció
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
