import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../services/api/authService.js";
import {
  getToken,
  getStoredUser,
} from "../../services/storage/storageService.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const preselectedInstructorId = queryParams.get("instructorId") || "";

  const [selectedInstructor, setSelectedInstructor] = useState(
    preselectedInstructorId,
  );
  const [turelem, setTurelem] = useState(0);
  const [turelемHover, setTurelемHover] = useState(0);
  const [szaktudas, setSzaktudas] = useState(0);
  const [szaktudasHover, setSzaktudasHover] = useState(0);
  const [kommunikacio, setKommunikacio] = useState(0);
  const [kommunikacioHover, setKommunikacioHover] = useState(0);
  const [rugalmasag, setRugalmasag] = useState(0);
  const [rugalmasagHover, setRugalmasagHover] = useState(0);
  const [tapasztalat, setTapasztalat] = useState("");

  const [Oktatok, setOktatok] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getOktatok = () => {
    if (!isLoggedIn || !user?.id) return;
    api
      .get(`/user/${user.id}/instructors`)
      .then((res) => {
        setOktatok(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user instructors:", err);
        setOktatok([]);
      });
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Hozzáférés megtagadva! Kérlek, jelentkezz be.");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/user/${user.id}/instructors`)
        .then((res) => {
          setOktatok(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user instructors:", err);
          setOktatok([]);
        });
    }
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [user?.id]);

  const resetRatings = () => {
    setTurelem(0);
    setTurelемHover(0);
    setSzaktudas(0);
    setSzaktudasHover(0);
    setKommunikacio(0);
    setKommunikacioHover(0);
    setRugalmasag(0);
    setRugalmasagHover(0);
    setTapasztalat("");
    setSelectedInstructor("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInstructor)
      return toast.warning("Kérlek, válassz egy oktatót!");
    if (!turelem || !szaktudas || !kommunikacio || !rugalmasag) {
      return toast.warning(
        "Kérlek, adj meg minden szempontra értékelést (csillagot)!",
      );
    }

    setIsSubmitting(true);

    try {
      const user = getStoredUser();
      const userId = user?.id;

      if (!userId) {
        setIsSubmitting(false);
        return toast.error(
          "Hiba történt! Kérlek, jelentkezz ki, majd lépj be újra.",
        );
      }

      // Kiszámoljuk az átlagos értékelést a 4 szempont alapján (és kerekítjük)
      // Kiszámoljuk az átlagos értékelést a 4 szempont alapján
      const calculatedRating = Math.round(
        (turelem + szaktudas + kommunikacio + rugalmasag) / 4,
      );

      // Pontosan azt az adatstruktúrát építjük fel, amit a Mongoose séma vár
      const reviewData = {
        user: userId,
        instructor: selectedInstructor,
        rating: calculatedRating, // Az átlag
        comment: tapasztalat, // A szöveg
        details: {
          // A részletek
          turelem,
          szaktudas,
          kommunikacio,
          rugalmasag,
        },
      };

      await api.post("/review/create", reviewData);

      setShowSuccessModal(true);
      resetRatings();

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Hiba az értékelés beküldésekor:", error);
      toast.error(
        error.response?.data?.error || "Hiba történt a beküldés során.",
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
                Sikeresen beküldve!
              </h2>
              <p className="text-gray-600 mb-6 font-medium">
                Köszönjük az értékelésed! Az értékelés továbbítva lett.
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
              Értékelés
            </h2>
            <p className="opacity-90 font-medium text-gray-400 text-lg">
              Oszd meg a tapasztalataidat...
            </p>
          </div>

          <form
            className="relative z-10 flex flex-col gap-3"
            onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Oktató
                </label>
                <select
                  id="oktato_mezo"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all appearance-none cursor-pointer">
                  <option value="" disabled>
                    Válassz egy oktatót
                  </option>
                  {Oktatok.map((oktato) => (
                    <option key={oktato._id} value={oktato._id}>
                      {oktato.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Türelem:
              </label>
              <div className="flex w-full justify-between max-w-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setTurelem(star)}
                      onMouseEnter={() => setTurelемHover(star)}
                      onMouseLeave={() => setTurelемHover(turelem)}
                      className={`text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${star <= (turelемHover || turelem) ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]" : "text-gray-600"}`}>
                      ★
                    </button>
                    <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                      {star}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Szaktudás:
              </label>
              <div className="flex w-full justify-between max-w-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSzaktudas(star)}
                      onMouseEnter={() => setSzaktudasHover(star)}
                      onMouseLeave={() => setSzaktudasHover(szaktudas)}
                      className={`text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${star <= (szaktudasHover || szaktudas) ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]" : "text-gray-600"}`}>
                      ★
                    </button>
                    <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                      {star}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Kommunikáció:
              </label>
              <div className="flex w-full justify-between max-w-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setKommunikacio(star)}
                      onMouseEnter={() => setKommunikacioHover(star)}
                      onMouseLeave={() => setKommunikacioHover(kommunikacio)}
                      className={`text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${star <= (kommunikacioHover || kommunikacio) ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]" : "text-gray-600"}`}>
                      ★
                    </button>
                    <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                      {star}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Rugalmaság:
              </label>
              <div className="flex w-full justify-between max-w-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setRugalmasag(star)}
                      onMouseEnter={() => setRugalmasagHover(star)}
                      onMouseLeave={() => setRugalmasagHover(rugalmasag)}
                      className={`text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${star <= (rugalmasagHover || rugalmasag) ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]" : "text-gray-600"}`}>
                      ★
                    </button>
                    <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                      {star}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <br />
            <div>
              <label className="text-s font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Tapasztalatod
              </label>
              <textarea
                maxLength={200}
                rows="5"
                placeholder="Írd ide..."
                value={tapasztalat}
                onChange={(e) => setTapasztalat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all resize-none"></textarea>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={resetRatings}
                disabled={isSubmitting}
                className="whitespace-nowrap w-full md:w-auto bg-gray-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-600/20 hover:shadow-gray-600/40 text-sm cursor-pointer disabled:opacity-50">
                Visszaállítás
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
