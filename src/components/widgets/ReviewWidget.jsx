import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReviewWidget() {

  let navigate = useNavigate();

  return (
    <div className="bg-[#3A4750] rounded-4xl p-2 flex flex-col justify-center border border-white/5 shadow-lg hover:scale-[1.02] duration-300">
      <Star className="text-[#F6C90E] mb-3" size={290} />
      <button onClick={() => navigate("/review")} className="w-1/2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter ml-19 transition-all duration-300 active:scale-95 cursor-pointer bg-[#F6C90E] text-black hover:scale-[1.02] disabled:opacity-50">Értékelj most</button>
    </div>
  );
}
