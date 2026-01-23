import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatisticsWidget() {
  return (
    <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner">
      <TrendingUp className="text-[#F6C90E] mb-1" size={28} />
      <span className="text-2xl font-black text-white">2,482</span>
      <p className="text-[9px] uppercase font-bold text-gray-500">
        Sikeres Vizsga
      </p>
    </div>
  );
}
