import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Star, MapPin, Users } from "lucide-react";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateLeaderboard = async () => {
      try {
        // 1. Lekérjük az összes oktatót
        const resInstructors = await axios.get(
          "http://localhost:3300/api/v1/instructor",
        );
        const instructors = resInstructors.data;

        // 2. Lekérjük mindegyikhez az értékeléseket és kiszámoljuk az átlagot
        const leaderboardData = await Promise.all(
          instructors.map(async (inst) => {
            try {
              const resReviews = await axios.get(
                `http://localhost:3300/api/v1/review/instructor/${inst._id}`,
              );
              const reviews = resReviews.data;

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

              const average =
                validCount > 0 ? (totalScore / validCount).toFixed(1) : 0;

              return {
                ...inst,
                average: Number(average),
                reviewCount: validCount,
              };
            } catch (error) {
              console.error(`Hiba az oktató (${inst._id}) értékeléseinek lekérésekor:`, error);
              return { ...inst, average: 0, reviewCount: 0 };
            }
          }),
        );

        // 3. Sorba rendezzük őket (Elsődleges: Átlag, Másodlagos: Értékelések száma)
        const sortedLeaderboard = leaderboardData
          .filter((inst) => inst.reviewCount > 0) // Csak azokat mutatjuk, akiknek van már értékelése
          .sort((a, b) => {
            if (b.average === a.average) {
              return b.reviewCount - a.reviewCount;
            }
            return b.average - a.average;
          });

        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error("Hiba a ranglista betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#F6C90E] rounded-full animate-spin mb-4"></div>
        <h2 className="text-[#F6C90E] font-bold text-xl">
          Ranglista összeállítása...
        </h2>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3, 20); // Top 20-ig mutatjuk a listát

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-[#F6C90E]/10 rounded-full mb-4">
          <Trophy size={40} className="text-[#F6C90E]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Top Oktatók Ranglistája
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A tanulók valós értékelései alapján Magyarország legjobb autósoktatói.
          Keresd a minőséget és a türelmet!
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-[#21272D] rounded-3xl p-12 text-center border border-white/5 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2">
            Még nincs elég adat
          </h3>
          <p className="text-gray-400">
            Jelenleg egyetlen oktatónak sincs érvényes értékelése a ranglista
            felállításához.
          </p>
        </div>
      ) : (
        <>
          {/* --- A DOBOGÓ (Top 3) --- */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 mb-20 px-4">
            {/* 2. Helyezett (Ezüst) */}
            {topThree[1] && (
              <div
                onClick={() => navigate(`/instructor/${topThree[1]._id}`)}
                className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center group cursor-pointer">
                <div className="w-full bg-linear-to-b from-[#E5E7EB]/20 to-[#21272D] border border-[#E5E7EB]/30 rounded-t-3xl p-6 flex flex-col items-center transform transition-transform group-hover:-translate-y-2 shadow-[0_0_30px_rgba(229,231,235,0.1)]">
                  <div className="w-20 h-20 bg-[#1A1F25] rounded-full border-4 border-[#E5E7EB] mb-4 flex items-center justify-center text-gray-500 shadow-inner">
                    Kép
                  </div>
                  <h3 className="font-bold text-xl text-white text-center mb-1">
                    {topThree[1].name}
                  </h3>
                  <div className="flex items-center gap-1 text-[#E5E7EB] font-black text-lg bg-black/30 px-4 py-1 rounded-full mb-3">
                    {topThree[1].average} <Star size={16} fill="currentColor" />
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Users size={14} /> {topThree[1].reviewCount} vélemény
                  </p>
                </div>
                <div className="w-full h-32 bg-linear-to-b from-[#E5E7EB]/40 to-[#1A1F25] rounded-b-3xl border-x border-b border-[#E5E7EB]/20 flex items-start justify-center pt-4">
                  <span className="text-4xl font-black text-white/50">2</span>
                </div>
              </div>
            )}

            {/* 1. Helyezett (Arany) */}
            {topThree[0] && (
              <div
                onClick={() => navigate(`/instructor/${topThree[0]._id}`)}
                className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center group cursor-pointer z-10 -mt-8 md:mt-0">
                <div className="absolute -top-10 text-[#F6C90E] animate-bounce">
                  <Trophy size={48} />
                </div>
                <div className="w-full bg-linear-to-b from-[#F6C90E]/30 to-[#21272D] border border-[#F6C90E]/50 rounded-t-3xl p-8 flex flex-col items-center transform transition-transform group-hover:-translate-y-2 shadow-[0_0_50px_rgba(246,201,14,0.2)]">
                  <div className="w-28 h-28 bg-[#1A1F25] rounded-full border-4 border-[#F6C90E] mb-4 flex items-center justify-center text-gray-500 shadow-inner">
                    Kép
                  </div>
                  <h3 className="font-black text-2xl text-white text-center mb-1">
                    {topThree[0].name}
                  </h3>
                  <div className="flex items-center gap-1 text-[#F6C90E] font-black text-xl bg-black/40 px-5 py-1.5 rounded-full mb-3">
                    {topThree[0].average} <Star size={20} fill="currentColor" />
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Users size={14} /> {topThree[0].reviewCount} vélemény
                  </p>
                  <p className="text-xs text-[#F6C90E] mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={12} /> {topThree[0].location || "Budapest"}
                  </p>
                </div>
                <div className="w-full h-40 bg-linear-to-b from-[#F6C90E]/50 to-[#1A1F25] rounded-b-3xl border-x border-b border-[#F6C90E]/30 flex items-start justify-center pt-4">
                  <span className="text-5xl font-black text-[#F6C90E]/80 drop-shadow-lg">
                    1
                  </span>
                </div>
              </div>
            )}

            {/* 3. Helyezett (Bronz) */}
            {topThree[2] && (
              <div
                onClick={() => navigate(`/instructor/${topThree[2]._id}`)}
                className="w-full md:w-1/3 order-3 md:order-3 flex flex-col items-center group cursor-pointer">
                <div className="w-full bg-linear-to-b from-[#CD7F32]/20 to-[#21272D] border border-[#CD7F32]/30 rounded-t-3xl p-6 flex flex-col items-center transform transition-transform group-hover:-translate-y-2 shadow-[0_0_30px_rgba(205,127,50,0.1)]">
                  <div className="w-20 h-20 bg-[#1A1F25] rounded-full border-4 border-[#CD7F32] mb-4 flex items-center justify-center text-gray-500 shadow-inner">
                    Kép
                  </div>
                  <h3 className="font-bold text-xl text-white text-center mb-1">
                    {topThree[2].name}
                  </h3>
                  <div className="flex items-center gap-1 text-[#CD7F32] font-black text-lg bg-black/30 px-4 py-1 rounded-full mb-3">
                    {topThree[2].average} <Star size={16} fill="currentColor" />
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Users size={14} /> {topThree[2].reviewCount} vélemény
                  </p>
                </div>
                <div className="w-full h-24 bg-linear-to-b from-[#CD7F32]/40 to-[#1A1F25] rounded-b-3xl border-x border-b border-[#CD7F32]/20 flex items-start justify-center pt-4">
                  <span className="text-4xl font-black text-white/50">3</span>
                </div>
              </div>
            )}
          </div>

          {/* --- A TÖBBIEK LISTÁJA (4. helytől lefelé) --- */}
          {theRest.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white mb-4 px-2">
                További kiváló oktatók
              </h3>
              {theRest.map((inst, idx) => (
                <div
                  key={inst._id}
                  onClick={() => navigate(`/instructor/${inst._id}`)}
                  className="bg-[#21272D] border border-white/5 rounded-2xl p-4 md:p-6 flex items-center gap-6 hover:bg-[#303841] hover:border-[#F6C90E]/30 transition-all cursor-pointer shadow-lg">
                  <div className="w-12 text-center text-2xl font-black text-gray-600">
                    #{idx + 4}
                  </div>
                  <div className="w-14 h-14 bg-[#1A1F25] rounded-full border-2 border-white/10 hidden sm:flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                    Kép
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1">
                      {inst.name}
                    </h4>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-500" />{" "}
                      {inst.location || "Budapest"}
                      <span className="text-gray-600">|</span>
                      {inst.schools?.[0]?.name ||
                        inst.schools?.[0] ||
                        "Autósiskola"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[#F6C90E] font-black text-lg">
                      {inst.average} <Star size={16} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {inst.reviewCount} értékelés
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
