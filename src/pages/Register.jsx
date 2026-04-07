import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../assets/images/RAMI_logo.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// Common disposable email domains to block
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com",
  "throwam.com","yopmail.com","sharklasers.com","guerrillamailblock.com",
  "grr.la","guerrillamail.info","guerrillamail.biz","guerrillamail.de",
  "guerrillamail.net","guerrillamail.org","spam4.me","trashmail.com",
  "trashmail.me","trashmail.at","trashmail.io","fakeinbox.com",
  "dispostable.com","mailnull.com","spamgourmet.com","spamgourmet.net",
  "maildrop.cc","discard.email","tempr.email",
  "burnermail.io","tempinbox.com","getairmail.com","filzmail.com",
  "wegwerfmail.de","wegwerfmail.net","wegwerfmail.org","33mail.com",
  "anonaddy.com","spamherelots.com","spamhere.eu","jetable.fr.nf",
]);

// Common domain typo suggestions
const DOMAIN_TYPOS = {
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.ocm": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
  "iclod.com": "icloud.com",
  "icloud.con": "icloud.com",
};

function useEmailValidation() {
  const [emailStatus, setEmailStatus] = useState("idle");
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const debounceRef = useRef(null);

  const validateEmail = (email) => {
    // Always clear any pending API call first
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

    // Check for typos first
    if (DOMAIN_TYPOS[domain]) {
      setEmailSuggestion(`${parts[0]}@${DOMAIN_TYPOS[domain]}`);
      setEmailStatus("warning");
      setEmailError("Úgy tűnik, elgépelted a domaint. Erre gondoltál?");
      return;
    }

    // Check for disposable domains
    if (DISPOSABLE_DOMAINS.has(domain)) {
      setEmailStatus("invalid");
      setEmailError("Ideiglenes e-mail cím nem elfogadott.");
      return;
    }

    // Set checking state, then debounce the API call
    setEmailStatus("checking");

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.disify.com/api/email/${encodeURIComponent(email)}`
        );

        if (!res.ok) {
          setEmailStatus("valid");
          return;
        }

        const data = await res.json();

        if (!data.format) {
          setEmailStatus("invalid");
          setEmailError("Érvénytelen e-mail formátum.");
        } else if (data.disposable) {
          setEmailStatus("invalid");
          setEmailError("Ideiglenes e-mail cím nem elfogadott.");
        } else if (!data.dns) {
          setEmailStatus("invalid");
          setEmailError("Ez a domain nem létezik vagy nem fogad e-maileket.");
        } else {
          setEmailStatus("valid");
          setEmailError("");
        }
      } catch {
        // Network error — don't block the user, just accept
        setEmailStatus("valid");
        setEmailError("");
      }
    }, 700);
  };

  // Cleanup on unmount
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

  const API_URL = "http://localhost:3300";

  const RegisterFunc = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/v1/auth/register`, {
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
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Hiba történt a regisztráció során.";
      toast.error(errorMessage);
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
          <div className="gap-4">
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
          </div>

          {/* Email field with live validation */}
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
              {/* Status icon */}
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

            {/* Error message */}
            {emailError && emailStatus !== "warning" && (
              <p className="text-xs text-red-500 mt-1 ml-1">{emailError}</p>
            )}

            {/* Typo suggestion */}
            {emailSuggestion && (
              <p className="text-xs text-yellow-700 mt-1 ml-1">
                Erre gondoltál?{" "}
                <button
                  type="button"
                  className="font-bold underline hover:text-yellow-900 cursor-pointer"
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
                className={`w-full border rounded-xl px-4 py-2.5 focus:ring-2 outline-none transition-all pr-10 ${
                  password2.length > 0
                    ? password === password2
                      ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                      : "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-yellow-500 focus:ring-yellow-100"
                }`}
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

          {/* Password mismatch hint */}
          {password2.length > 0 && password !== password2 && (
            <p className="text-xs text-red-500 -mt-2 ml-1">A két jelszó nem egyezik.</p>
          )}

          <button
            disabled={!isFormValid || isSubmitting}
            onClick={RegisterFunc}
            className={`w-full rounded-xl py-4 font-bold text-white mt-4 transition-all transform active:scale-95 cursor-pointer ${
              isFormValid && !isSubmitting
                ? "bg-black hover:bg-gray-800 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            {isSubmitting ? "Kérlek várj..." : "Regisztráció"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Van már fiókod?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-yellow-600 font-bold hover:underline cursor-pointer">
              Jelentkezz be
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
