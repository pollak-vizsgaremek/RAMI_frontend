import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TopInstructor({ instr, isVisible }) {
  const navigate = useNavigate();

  return (
    <div
      className={`md:col-span-2 md:row-span-2 rounded-4xl p-8 flex flex-col justify-between transition-all duration-300 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

      <div className="relative z-10 flex items-start gap-4">
        {instr.profileImage ? (
          <div className="w-16 h-16 rounded-full border-2 border-[#F6C90E] overflow-hidden flex-shrink-0 shadow-lg">
            <img src={instr.profileImage} alt={instr.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
            <span className="text-[#F6C90E] font-black text-xl">{instr.name?.charAt(0) || "!"}</span>
          </div>
        )}
        <div>
          <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
            A hónap oktatója
          </span>
          <h3 className="text-3xl font-black leading-tight text-white mb-1">
            {instr.name}
          </h3>
          <p className="opacity-90 max-w-xs font-medium text-gray-400 text-sm">
            {instr.desc}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-3 flex-wrap">
        {instr.id && (
          <button
            onClick={() => navigate(`/instructor/${instr.id}`)}
            className="bg-white/10 border border-white/20 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-white/20 active:scale-95 transition-all">
            Profil megtekintése
          </button>
        )}
        <Link
          to="/leaderboard"
          className="bg-[#F6C90E] text-black px-6 py-3 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 text-sm">
          Ranglista megtekintése
        </Link>
      </div>
    </div>
  );
}
