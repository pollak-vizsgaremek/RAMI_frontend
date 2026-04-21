import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../services/api/authService.js";
import { toast } from "react-toastify";
import {
  getToken,
  getStoredUser,
} from "../../services/storage/storageService.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [userInstructors, setUserInstructors] = useState([]);
  const [nominationStatus, setNominationStatus] = useState(null);
  const [nominatingLoading, setNominatingLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Nincs azonosító megadva.");
      setLoading(false);
      return;
    }

    const fetchInstructorData = async () => {
      try {
        const resInstructor = await api.get(`/instructor/${id}`);
        setInstructor(resInstructor.data);

        const resReviews = await api.get(`/review/instructor/${id}`);
        setReviews(resReviews.data);
      } catch (err) {
        setError("Nem sikerült betölteni az oktató adatait.", err);
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };
    fetchInstructorData();
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const fetchUserInstructors = async () => {
        try {
          const res = await api.get(`/user/${user.id}/instructor`);
          const instructorIds = res.data.map((inst) => inst._id || inst.id);
          setUserInstructors(instructorIds);
          if (instructorIds.includes(id)) {
            setNominationStatus('confirmed');
          }
        } catch (err) {
          console.error("Failed to fetch user instructors:", err);
        }
      };
      fetchUserInstructors();
    }
  }, [isLoggedIn, user?.id, id]);

  useEffect(() => {
    if (!loading && !error && instructor) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading, error, instructor]);

  const calculateAverage = () => {
    if (!reviews || reviews.length === 0) return "Nincs értékelés";
    let validCount = 0;
    let totalScore = 0;

    reviews.forEach((r) => {
      const myRating = r.rating && r.rating[0] ? r.rating[0] : r;
      const t = Number(myRating.turelem) || 0;
      const s = Number(myRating.szaktudas) || 0;
      const k = Number(myRating.kommunikacio) || 0;
      const rug = Number(myRating.rugalmasag) || 0;

      if (t > 0 || s > 0 || k > 0 || rug > 0) {
        totalScore += (t + s + k + rug) / 4;
        validCount++;
      }
    });

    if (validCount === 0) return "Nincs értékelés";
    return (totalScore / validCount).toFixed(1) + " ★";
  };

  const handleReviewClick = () => {
    if (!getToken()) return toast.warning("Jelentkezz be az értékeléshez!");
    navigate(`/review?instructorId=${id}`);
  };

  const handleNominateClick = async () => {
    if (!isLoggedIn || !user?.id) {
      toast.warning("Jelentkezz be a jelöléshez!");
      return;
    }

    setNominatingLoading(true);
    try {
      await api.post(`/instructor/${id}/nominate`, { userId: user.id });
      setNominationStatus('pending');
      toast.success("Sikeres jelölés! Az oktató jelölésed függőben van.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiba a jelölés során.");
    } finally {
      setNominatingLoading(false);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    const token = getToken();
    const storedUser = getStoredUser();
    const userId = storedUser?.id;
    if (!token || !userId) return toast.warning("Jelentkezz be a kedveléshez!");

    try {
      await api.put(`/review/${reviewId}/helpful`, { userId });
      setReviews(
        reviews.map((review) => {
          if (review._id === reviewId) {
            const hasLiked = review.helpfulUsers?.includes(userId);
            return {
              ...review,
              helpfulCount: hasLiked
                ? review.helpfulCount - 1
                : (review.helpfulCount || 0) + 1,
              helpfulUsers: hasLiked
                ? review.helpfulUsers.filter((id) => id !== userId)
                : [...(review.helpfulUsers || []), userId],
            };
          }
          return review;
        }),
      );
    } catch (error) {
      toast.error("Nem sikerült elmenteni a kedvelést.", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#F6C90E] rounded-full mb-4 animate-spin"></div>
      </main>
    );
  }

  if (error || !instructor) {
    return (
      <main className="min-h-screen pt-28 pb-12 flex flex-col items-center justify-center">
        <div className="text-red-500 text-2xl font-bold mb-4">
          ⚠️ Hiba történt
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#F6C90E] text-black font-bold rounded-xl cursor-pointer">
          Vissza a főoldalra
        </button>
      </main>
    );
  }

  const validReviewCount = reviews.filter(
    (r) => (Number(r.rating?.[0]?.turelem) || 0) > 0,
  ).length;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful")
      return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    if (sortBy === "highest") {
      const aAvg =
        ((Number(a.rating?.[0]?.turelem) || 0) +
          (Number(a.rating?.[0]?.szaktudas) || 0) +
          (Number(a.rating?.[0]?.kommunikacio) || 0) +
          (Number(a.rating?.[0]?.rugalmasag) || 0)) /
        4;
      const bAvg =
        ((Number(b.rating?.[0]?.turelem) || 0) +
          (Number(b.rating?.[0]?.szaktudas) || 0) +
          (Number(b.rating?.[0]?.kommunikacio) || 0) +
          (Number(b.rating?.[0]?.rugalmasag) || 0)) /
        4;
      return bAvg - aAvg;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col">
      <div
        className={`w-full rounded-4xl p-8 md:p-12 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <div className="w-full aspect-4/3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden group/img">
              <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400">
                <span className="text-sm">Profilkép</span>
              </div>
            </div>
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Átlagos Értékelés
              </span>
              <span
                className={`text-3xl font-black ${validReviewCount > 0 ? "text-[#F6C90E]" : "text-gray-500"}`}>
                {calculateAverage()}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {validReviewCount} vélemény alapján
              </span>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-start">
            <div className="mb-6">
              <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block mb-3">
                Kiemelt Oktató
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                {instructor.name}
              </h2>
              <p className="opacity-90 font-medium text-gray-400 text-lg">
                {instructor.age
                  ? `${instructor.age} éves`
                  : "Kora nem publikus"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                  Iskola
                </h4>
                <p className="font-medium text-white text-lg">
                  {instructor.schools?.[0]?.name ||
                    instructor.schools?.[0] ||
                    "Ismeretlen"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                  Tapasztalat
                </h4>
                <p className="font-medium text-white text-lg">
                  {instructor.experience
                    ? `${instructor.experience} éve tanít`
                    : "Nincs adat"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="w-full md:w-2/3 flex flex-col gap-5">
            <h3 className="text-xl font-bold text-white px-1">Elérhetőségek</h3>
            <div className="flex flex-col sm:flex-row gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                  E-mail
                </h4>
                <a
                  href={`mailto:${instructor.email}`}
                  className="font-medium text-[#F6C90E] hover:underline text-lg break-all">
                  {instructor.email}
                </a>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                  Telefon
                </h4>
                <a
                  href={`tel:${instructor.phoneNumber}`}
                  className="font-medium text-white hover:text-[#F6C90E] text-lg">
                  {instructor.phoneNumber}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {nominationStatus === 'confirmed' ? (
              <button
                onClick={handleReviewClick}
                className="whitespace-nowrap w-full md:w-auto bg-gray-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wide hover:bg-gray-600 active:scale-95 transition-all text-sm cursor-pointer">
                Értékelés
              </button>
            ) : nominationStatus === 'pending' ? (
              <button
                disabled
                className="whitespace-nowrap w-full md:w-auto bg-gray-600 text-gray-400 px-8 py-4 rounded-2xl font-black uppercase tracking-wide text-sm cursor-not-allowed opacity-60">
                Függő jelölés
              </button>
            ) : (
              <button
                onClick={handleNominateClick}
                disabled={nominatingLoading}
                className="whitespace-nowrap w-full md:w-auto bg-gray-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wide hover:bg-gray-600 active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-60">
                {nominatingLoading ? "Jelölés..." : "Jelölés"}
              </button>
            )}
            <button className="whitespace-nowrap w-full md:w-auto bg-[#F6C90E] text-black px-8 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40">
              Kapcsolat
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
            <h3 className="text-2xl font-bold text-white">
              Tanulói Értékelések
            </h3>

            {validReviewCount > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Rendezés:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#21272D] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F6C90E] cursor-pointer">
                  <option value="newest">Legújabb elöl</option>
                  <option value="helpful">Leginkább hasznos</option>
                  <option value="highest">Legjobb értékelés</option>
                </select>
              </div>
            )}
          </div>

          {loadingReviews ? (
            <div className="text-gray-400 font-medium text-sm p-4 text-center">
              Vélemények betöltése...
            </div>
          ) : validReviewCount === 0 ? (
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
              <p className="text-gray-400 text-lg mb-2">
                Még nincs értékelés ehhez az oktatóhoz.
              </p>
              <p className="text-gray-500 text-sm">Légy te az első!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-2">
              {sortedReviews.map((review) => {
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
                    className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-[#F6C90E]/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-white">
                          {review.user?.name || "Névtelen Tanuló"}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "hu-HU",
                          )}
                        </span>
                      </div>
                      <span className="bg-[#F6C90E]/10 border border-[#F6C90E]/20 px-3 py-1 rounded-full text-sm font-black text-[#F6C90E]">
                        {avg} ★
                      </span>
                    </div>

                    {myRating.tapasztalat && (
                      <p className="text-gray-300 mb-5 leading-relaxed bg-black/20 p-4 rounded-xl italic">
                        "{myRating.tapasztalat}"
                      </p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500 uppercase font-bold bg-white/5 p-3 rounded-xl mb-4">
                      <div className="flex flex-col gap-1">
                        <span>Türelem</span>{" "}
                        <span className="text-white text-base">{t}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span>Szaktudás</span>{" "}
                        <span className="text-white text-base">{s}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span>Kommunikáció</span>{" "}
                        <span className="text-white text-base">{k}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span>Rugalmaság</span>{" "}
                        <span className="text-white text-base">{rug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleHelpfulClick(review._id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${review.helpfulUsers?.includes(getStoredUser()?.id) ? "bg-[#F6C90E] text-black shadow-[0_0_10px_rgba(246,201,14,0.3)]" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                        👍 Hasznos ({review.helpfulCount || 0})
                      </button>
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
