import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isVisible, setIsVisible] = useState(false);

  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Kérlek, jelentkezz be a profilod megtekintéséhez.");
      navigate("/");
      return;
    }

    const name = sessionStorage.getItem("userName") || "Ismeretlen Felhasználó";
    const email = sessionStorage.getItem("userEmail") || "Nincs e-mail megadva";
    const phone = sessionStorage.getItem("userPhone") || "Nincs megadva";
    setUserData({ name, email, phone });

    const fetchMyReviews = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const res = await axios.get(
          `http://localhost:3300/api/v1/review/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMyReviews(res.data);
      } catch (err) {
        console.error("Nem sikerült betölteni az értékeléseket:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchMyReviews();

    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [navigate]);

  // NEW FEATURE: Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Biztosan törölni szeretnéd ezt az értékelést? Ezt nem lehet visszavonni.",
      )
    ) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:3300/api/v1/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove it from the screen instantly
      setMyReviews(myReviews.filter((review) => review._id !== reviewId));
      toast.success("Értékelés sikeresen törölve!");
    } catch (error) {
      console.error("Hiba törléskor:", error);
      toast.error("Nem sikerült törölni az értékelést.");
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col">
      <div
        className={`w-full rounded-4xl p-8 md:p-12 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <div className="w-full aspect-4/3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center text-gray-400">
                <span className="font-medium text-sm">Profilkép helye</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-start">
            <div className="mb-6">
              <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                Felhasználó
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2">
                {userData.name}
              </h2>
              <p className="opacity-90 font-medium text-gray-400 text-lg">
                Regisztrált tag
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="w-full flex flex-col gap-5">
            <h3 className="text-xl font-bold text-white px-1">Elérhetőségek</h3>
            <div className="flex flex-col sm:flex-row gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  E-mail
                </h4>
                <a
                  href={`mailto:${userData.email}`}
                  className="font-medium text-[#F6C90E] hover:underline text-lg transition-all break-all drop-shadow-md">
                  {userData.email}
                </a>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Telefon
                </h4>
                <a
                  href={
                    userData.phone !== "Nincs megadva"
                      ? `tel:${userData.phone}`
                      : "#"
                  }
                  className={`font-medium text-lg transition-colors ${userData.phone !== "Nincs megadva" ? "text-white hover:text-[#F6C90E]" : "text-gray-500 cursor-default"}`}>
                  {userData.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col gap-5">
          <h3 className="text-xl font-bold text-white px-1">
            Saját Értékeléseim
          </h3>

          {loadingReviews ? (
            <div className="text-gray-400 font-medium text-sm p-4 text-center">
              Értékelések betöltése...
            </div>
          ) : myReviews.length === 0 ? (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-4">
                Még nem írtál egyetlen értékelést sem.
              </p>
              <button
                onClick={() => navigate("/review")}
                className="bg-gray-700 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-600 transition-colors cursor-pointer">
                Értékelés írása
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myReviews.map((review) => {
                const myRating =
                  review.rating && review.rating[0] ? review.rating[0] : review;
                const t = Number(myRating.turelem) || 0;
                const s = Number(myRating.szaktudas) || 0;
                const k = Number(myRating.kommunikacio) || 0;
                const rug = Number(myRating.rugalmasag) || 0;

                if (
                  t === 0 &&
                  s === 0 &&
                  k === 0 &&
                  rug === 0 &&
                  !myRating.tapasztalat
                )
                  return null;
                const avg = ((t + s + k + rug) / 4).toFixed(1);

                return (
                  <div
                    key={review._id}
                    className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#F6C90E]/30 transition-colors relative">
                    {/* NEW: Delete Button */}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 cursor-pointer"
                      title="Értékelés törlése">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>

                    <div className="flex justify-between items-start mb-3 pr-10">
                      <h4 className="font-bold text-lg text-white">
                        {review.instructor?.name || "Ismeretlen Oktató"}
                      </h4>
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#F6C90E]">
                        Átlag: {avg} ★
                      </span>
                    </div>
                    {myRating.tapasztalat && (
                      <p className="text-gray-400 text-sm mb-4 italic">
                        "{myRating.tapasztalat}"
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
                      <div>
                        Türelem: <span className="text-white">{t}</span>
                      </div>
                      <div>
                        Szaktudás: <span className="text-white">{s}</span>
                      </div>
                      <div>
                        Kommunikáció: <span className="text-white">{k}</span>
                      </div>
                      <div>
                        Rugalmaság: <span className="text-white">{rug}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
