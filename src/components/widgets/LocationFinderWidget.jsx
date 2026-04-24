import React from "react";
import { Navigation, ChevronRight } from "lucide-react";
import { EXAM_CENTERS } from "./widgetConstants.js";

export default function LocationFinderWidget({
  nearestCenter,
  locLoading,
  onFindNearest,
}) {
  return (
    <div className="row-span-2 h-full bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 flex flex-col justify-between border border-white/10 shadow-2xl group relative overflow-hidden hover:scale-[1.02] duration-300">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-15 transition-opacity duration-500" />

      <div className="flex justify-between items-start relative z-10">
        <div
          className={`p-3 rounded-xl transition-all duration-300 ${
            locLoading
              ? "bg-[#F6C90E] text-black rotate-12"
              : "bg-white/5 text-[#F6C90E]"
          }`}>
          <Navigation size={24} className={locLoading ? "animate-pulse" : ""} />
        </div>
        <span className="text-[14px] font-black text-gray-500 uppercase tracking-widest bg-black/20 px-2 py-1 rounded-md">
          Live Locator
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {nearestCenter ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-white font-bold text-base tracking-tight">
                {nearestCenter.name}
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#F6C90E] text-2xl font-black">
                {nearestCenter.distance}
              </span>
              <span className="text-[#F6C90E] text-xs font-bold uppercase">
                km tőled
              </span>
            </div>
            <div className="flex gap-2 mt-3">
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
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            Keresd meg a legközelebbi{" "}
            <span className="text-[#F6C90E]">vizsgahelyet</span>
          </p>
        )}
      </div>

      <div className="mt-6 relative z-10">
        {locLoading && (
          <div className="w-full bg-white/5 h-1.5 rounded-full mb-3 overflow-hidden">
            <div className="bg-[#F6C90E] h-full w-1/3 animate-pulse" />
          </div>
        )}
        <button
          onClick={onFindNearest}
          disabled={locLoading}
          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 cursor-pointer ${
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
