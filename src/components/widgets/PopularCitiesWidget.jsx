import React from "react";
import { MapPin } from "lucide-react";

export default function PopularCitiesWidget() {
  return (
    <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-center border border-white/5 hover:scale-[1.02] duration-300">
      <h5 className="font-bold text-[11px] text-gray-400 uppercase mb-3 flex items-center gap-2">
        <MapPin size={12} className="text-[#F6C90E]" /> Népszerű Városok
      </h5>
      <div className="flex flex-wrap gap-2">
        {["Budapest", "Debrecen", "Szeged"].map((city) => (
          <span
            key={city}
            className="bg-[#303841] text-[10px] px-3 py-1 rounded-full font-bold text-[#EEEEEE] border border-white/5 ">
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}
