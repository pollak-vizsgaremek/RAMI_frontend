import React from "react";
import { CloudSun, Wind, Droplets } from "lucide-react";

export default function WeatherWidget() {
  return (
    <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between group">
      {/* Background Elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 opacity-10 blur-3xl group-hover:opacity-15 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-md block w-fit mb-1">
            Budapest
          </span>
          <h3 className="text-3xl font-black text-white tracking-tight">
            24°C
          </h3>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-yellow-400">
          <CloudSun size={24} />
        </div>
      </div>

      <div className="z-10">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
          Ideális vezetéshez
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Wind size={12} className="text-[#F6C90E]" />
            <span className="text-[10px] font-bold">12 km/h</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Droplets size={12} className="text-blue-400" />
            <span className="text-[10px] font-bold">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
