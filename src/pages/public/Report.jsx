import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../services/api/authService.js";
import {
  getToken,
  getStoredUser,
} from "../../services/storage/storageService.js";

export default function Report() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = [
    "Technikai hiba",
    "Biztonsági probléma",
    "Felhasználói élmény",
    "Teljesítmény",
    "Funkció kérés",
    "Egyéb",
  ];

  useEffect(() => {
    const user = getStoredUser();
    if (user?.email) {
      setEmail(user.email);
    }

    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) return toast.warning("Kérlek, válassz egy kategóriát!");
    if (!description.trim())
      return toast.warning("Kérlek, írd le a hibát részletesen!");

    setIsSubmitting(true);

    try {
      const user = getStoredUser();

      const reportData = {
        user: user?.id || null,
        email: email || "Nem megadva",
        category,
        description,
      };

      await api.post("/report/create", reportData);

      setShowSuccessModal(true);
      setCategory("");
      setDescription("");

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Hiba a hibajelentés beküldésekor:", error);
      toast.error(
        error.response?.data?.error ||
          "Hiba történt a hibajelentés beküldésekor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl p-8 md:p-12 max-w-md w-full shadow-2xl animate-bounce">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-[#F6C90E] rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Köszönjük!
              </h2>
              <p className="text-gray-600 mb-6 font-medium">
                A hibajelentésed sikeresen elküldtük. Hamarosan megvizsgáljuk.
              </p>
              <p className="text-sm text-gray-500">
                Átirányítunk az kezdőlapra...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col">
        <div
          className={`w-full rounded-4xl p-8 md:p-12 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500 pointer-events-none"></div>

          <div className="relative z-10 mb-8 pb-6 border-b border-white/10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2">
              Hibajelentés
            </h2>
            <p className="opacity-90 font-medium text-gray-400 text-lg">
              Segíts nekünk fejlődni...
            </p>
          </div>

          <form
            className="relative z-10 flex flex-col gap-6"
            onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Kategória
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all appearance-none cursor-pointer">
                <option value="" disabled>
                  Válassz egy kategóriát
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                E-mail cím
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="a@b.com"
                className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                A hiba leírása
              </label>
              <textarea
                maxLength={500}
                rows="8"
                placeholder="Részletezd a hibát, hogy pontosan megérthessük mit kell javítani..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all resize-none"></textarea>
              <p className="text-xs text-gray-500 mt-2">
                {description.length}/500 karakter
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="whitespace-nowrap w-full md:w-auto bg-gray-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-600/20 hover:shadow-gray-600/40 text-sm cursor-pointer disabled:opacity-50">
                Mégse
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="whitespace-nowrap w-full md:w-auto bg-[#F6C90E] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 text-sm cursor-pointer disabled:opacity-50">
                {isSubmitting ? "Küldés..." : "Beküldés"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
