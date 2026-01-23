import React from "react";
import { Navigation, ChevronRight } from "lucide-react";
import { EXAM_CENTERS } from "./constants";

export default function LocationFinderWidget({
  nearestCenter,
  locLoading,
  onFindNearest,
}) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 flex flex-col justify-between border border-white/10 shadow-2xl group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-15 transition-opacity duration-500" />

      <div className="flex justify-between items-start relative z-10">
        <div
          className={`p-2 rounded-xl transition-all duration-300 ${
            locLoading
              ? "bg-[#F6C90E] text-black rotate-12"
              : "bg-white/5 text-[#F6C90E]"
          }`}>
          <Navigation
            size={18}
            className={locLoading ? "animate-pulse" : ""}
          />
        </div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/20 px-2 py-1 rounded-md">
          Live Locator
        </span>
      </div>

      <div className="mt-4 relative z-10">
        {nearestCenter ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-white font-bold text-sm tracking-tight">
                {nearestCenter.name}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[#F6C90E] text-lg font-black">
                {nearestCenter.distance}
              </span>
              <span className="text-[#F6C90E] text-[10px] font-bold uppercase ml-1">
                km tőled
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                {nearestCenter.type}
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCenter.lat},${nearestCenter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-[#F6C90E] hover:underline flex items-center gap-1 font-bold">
                Útvonalterv <ChevronRight size={10} />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-xs font-medium leading-relaxed">
            Keresd meg a legközelebbi{" "}
            <span className="text-[#F6C90E]">vizsgahelyet</span>
          </p>
        )}
      </div>

      <div className="mt-4 relative z-10">
        {locLoading && (
          <div className="w-full bg-white/5 h-1 rounded-full mb-3 overflow-hidden">
            <div className="bg-[#F6C90E] h-full animate-[progress_1.5s_ease-in-out_infinite] w-1/3" />
          </div>
        )}
        <button
          onClick={onFindNearest}
          disabled={locLoading}
          className={`w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all duration-300 active:scale-95 ${
            nearestCenter
              ? "bg-white/5 text-white hover:bg-white/10"
              : "bg-[#F6C90E] text-black hover:scale-[1.02]"
          } disabled:opacity-50`}>
          {locLoading
            ? "Pozíció lekérése..."
            : nearestCenter
            ? "Új mérés"
            : "Központ keresése"}
        </button>
      </div>
    </div>
  );
}
