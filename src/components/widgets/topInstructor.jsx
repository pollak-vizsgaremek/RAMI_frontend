import React from "react";
import { Link } from "react-router";

export default function TopInstructor({ instr, isVisible }) {
  return (
    <div
      className={`md:col-span-2 md:row-span-2 rounded-4xl p-8 flex flex-col justify-between transition-all duration-300 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

      <div className="relative z-10">
        <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-6">
          A hónap oktatója
        </span>
        <h3 className="text-4xl font-black leading-tight text-white mb-2">
          {instr.name}
        </h3>
        <p className="opacity-90 max-w-xs font-medium text-gray-400">
          {instr.desc}
        </p>
      </div>
      {/* <button className="relative z-10 w-fit bg-[#F6C90E] text-black px-6 py-3 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40" onClick={() => window.location.href = "/instructor-profile"}>
        Profil megtekintése
      </button> */}
      <Link
        to="/leaderboard"
        className="relative z-10 w-fit bg-[#F6C90E] text-black px-6 py-3 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40">
        Ranglista megtekintése
      </Link>
    </div>
  );
}
