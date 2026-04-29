import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Clock, User as UserIcon } from "lucide-react";
import { api } from "../../services/api/authService.js";
import { getStoredUser } from "../../services/storage/storageService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = getStoredUser();
  const isInstructor = user?.role === "instructor";
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      toast.warning("Jelentkezz be az értékeléseid megtekintéséhez!");
      navigate("/");
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        let res;
        if (isInstructor) {
          // Oktató: kapott értékelések
          res = await api.get(`/review/instructor/${userId}`);
        } else {
          // Felhasználó: saját értékelések
          res = await api.get(`/review/user/${userId}`);
        }
        setReviews(res.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Nem sikerült az értékelések betöltése");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [userId, isInstructor, navigate]);

  const getRatingAvg = (review) => {
    const d = review.details;
    if (d && d.turelem) {
      return ((d.turelem + d.szaktudas + d.kommunikacio + d.rugalmasag) / 4).toFixed(1);
    }
    return review.rating || "—";
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#F6C90E] rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">
          {isInstructor ? "Kapott értékeléseim" : "Értékeléseim"}
        </h1>
        <p className="text-gray-400 text-lg">
          {isInstructor
            ? "A tanulóid által írt értékelések"
            : "Az általad írt értékelések"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-xl font-bold mb-2">
            {isInstructor ? "Még nem kaptál értékelést" : "Még nem írtál értékelést"}
          </p>
          <p className="text-gray-500 text-sm">
            {isInstructor
              ? "Ha tanulóid értékelnek, itt fognak megjelenni."
              : "Értékeld az oktatóidat és itt fognak megjelenni."}
          </p>
          {!isInstructor && (
            <button
              onClick={() => navigate("/review")}
              className="mt-6 px-6 py-3 bg-[#F6C90E] text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Értékelés írása
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const avg = getRatingAvg(review);
            const d = review.details || {};

            return (
              <div
                key={review._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#F6C90E]/30 transition-colors">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <UserIcon size={18} className="text-gray-400" />
                      {isInstructor
                        ? review.user?.name || "Névtelen tanuló"
                        : review.instructor?.name || "Ismeretlen oktató"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("hu-HU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#F6C90E]/10 border border-[#F6C90E]/20 px-4 py-1.5 rounded-full text-lg font-black text-[#F6C90E]">
                    {avg} ★
                  </span>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-gray-300 mb-5 leading-relaxed bg-black/20 p-4 rounded-xl italic">
                    "{review.comment}"
                  </p>
                )}

                {/* Detail scores */}
                {d.turelem && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 uppercase font-bold bg-white/5 p-4 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <span>Türelem</span>
                      <span className="text-white text-base">{d.turelem}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Szaktudás</span>
                      <span className="text-white text-base">{d.szaktudas}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Kommunikáció</span>
                      <span className="text-white text-base">{d.kommunikacio}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Rugalmaság</span>
                      <span className="text-white text-base">{d.rugalmasag}</span>
                    </div>
                  </div>
                )}

                {/* Status badge */}
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      review.approvalStatus === "approved"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : review.approvalStatus === "rejected"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                    {review.approvalStatus === "approved"
                      ? "✓ Jóváhagyva"
                      : review.approvalStatus === "rejected"
                        ? "✗ Elutasítva"
                        : "⏳ Függőben"}
                  </span>
                  {review.helpfulCount > 0 && (
                    <span className="text-xs text-gray-500">
                      👍 {review.helpfulCount} hasznos
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyReviews;
