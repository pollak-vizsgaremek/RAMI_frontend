import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Trophy, Medal, User } from "lucide-react";

export default function Leaderboard() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3300/api/v1/instructor/leaderboard")
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Hiba a ranglista betöltésekor:", err))
      .finally(() => setLoading(false));
  }, []);

  const getMedalColor = (idx) => {
    if (idx === 0) return "text-yellow-400";
    if (idx === 1) return "text-gray-300";
    if (idx === 2) return "text-amber-600";
    return "text-gray-500";
  };

  const getBgGlow = (idx) => {
    if (idx === 0) return "border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.1)]";
    if (idx === 1) return "border-gray-400/20";
    if (idx === 2) return "border-amber-600/20";
    return "border-white/5";
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={40} className="text-[#F6C90E]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Oktatói Ranglista
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          A legjobban értékelt 30 oktató, a tanulók visszajelzései alapján.
        </p>
      </div>

      {/* Top 3 podium */}
      {!loading && instructors.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[instructors[1], instructors[0], instructors[2]].map((inst, podiumIdx) => {
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const realIdx = rank - 1;
            const heights = ["h-24", "h-32", "h-20"];
            return (
              <div
                key={inst._id}
                onClick={() => navigate(`/instructor/${inst._id}`)}
                className="flex flex-col items-center cursor-pointer group">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-white/10 border-2 flex items-center justify-center mb-2 ${getMedalColor(realIdx)} group-hover:scale-110 transition-transform overflow-hidden shadow-lg`}>
                    {inst.profileImage ? (
                      <img src={inst.profileImage} alt={inst.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black">{rank}</span>
                    )}
                  </div>
                  {inst.profileImage && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-[#303841] rounded-full flex items-center justify-center border border-[#303841] shadow-sm ${getMedalColor(realIdx)}`}>
                      <span className="text-xs font-black">{rank}</span>
                    </div>
                  )}
                </div>
                <p className="text-white font-bold text-sm text-center leading-tight mb-1 group-hover:text-[#F6C90E] transition-colors">
                  {inst.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-[#F6C90E] fill-[#F6C90E]" />
                  <span className="text-[#F6C90E] text-xs font-black">{inst.averageRating}</span>
                </div>
                <div className={`w-full ${heights[podiumIdx]} bg-white/5 rounded-t-2xl mt-3 border border-white/10 ${podiumIdx === 1 ? "bg-[#F6C90E]/10 border-[#F6C90E]/20" : ""}`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#F6C90E] rounded-full animate-spin" />
        </div>
      ) : instructors.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-xl font-bold">Még nincs értékelt oktató</p>
          <p className="text-gray-500 mt-2">Az értékelések megjelennek majd itt.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {instructors.map((inst, idx) => (
            <div
              key={inst._id}
              onClick={() => navigate(`/instructor/${inst._id}`)}
              className={`bg-white/5 border rounded-2xl px-6 py-4 flex items-center gap-5 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer group ${getBgGlow(idx)}`}>
              {/* Rank & Image */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${idx < 3 ? "bg-white/10" : ""} ${getMedalColor(idx)}`}>
                  {idx < 3 ? <Medal size={22} /> : <span className="text-gray-500 text-sm">{idx + 1}</span>}
                </div>
                {inst.profileImage ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 flex-shrink-0 shadow-md">
                    <img src={inst.profileImage} alt={inst.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
              </div>

              {/* Name + city */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white group-hover:text-[#F6C90E] transition-colors truncate">
                  {inst.name}
                </h3>
                {inst.city && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-gray-500" />
                    <span className="text-gray-500 text-xs">{inst.city}</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-center gap-1.5 bg-[#F6C90E]/10 border border-[#F6C90E]/20 px-3 py-1 rounded-xl">
                  <Star size={14} className="text-[#F6C90E] fill-[#F6C90E]" />
                  <span className="text-[#F6C90E] font-black text-sm">{inst.averageRating}</span>
                </div>
                <span className="text-gray-600 text-xs mt-1">{inst.reviewCount} értékelés</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
