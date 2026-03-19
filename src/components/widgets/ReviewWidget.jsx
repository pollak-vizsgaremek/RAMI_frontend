import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReviewWidget() {
  let navigate = useNavigate();

  return (
    <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 md:p-8 flex flex-col justify-between border border-white/10 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F6C90E] rounded-full blur-[60px] -mr-10 -mt-10 opacity-10 group-hover:opacity-20 transition-all duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <button onClick={() => navigate("/review")}>
          <div className="w-16 h-16 bg-[#F6C90E]/10 rounded-full flex items-center justify-center mb-4 border border-[#F6C90E]/20 cursor-pointer">
            <Star className="text-[#F6C90E]" size={32} fill="currentColor" />
          </div>
        </button>

        <h3 className="text-white font-bold text-xl mb-2 tracking-tight">
          Oktató Értékelése
        </h3>
      </div>
    </div>
  );
}
