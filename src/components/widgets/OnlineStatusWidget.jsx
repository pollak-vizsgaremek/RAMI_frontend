import React from "react";
import { Activity } from "lucide-react";

export default function OnlineStatusWidget({ onlineCount }) {
  return (
    <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-lg">
      <div className="relative mb-2">
        <Activity className="text-[#F6C90E] animate-ping absolute inset-0 opacity-20" />
        <Activity className="text-[#F6C90E] relative" />
      </div>
      <span className="text-3xl font-black text-[#F6C90E] tabular-nums">
        {onlineCount}
      </span>
      <p className="text-[10px] uppercase font-bold text-gray-400">
        Oktató Online
      </p>
    </div>
  );
}
