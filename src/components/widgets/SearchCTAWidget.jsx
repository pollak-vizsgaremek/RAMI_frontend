import React from "react";
import { Search, ChevronRight } from "lucide-react";

export default function SearchCTAWidget() {
  return (
    <div className="md:col-span-2 rounded-4xl border-2 border-dashed border-white/10 hover:border-[#F6C90E]/50 hover:bg-white/5 transition-all group cursor-pointer flex items-center justify-between px-8 bg-[#3A4750]/30">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-[#F6C90E] rounded-2xl text-black group-hover:rotate-12 transition-transform">
          <Search size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">
            Keress rá az oktatódra
          </h4>
          <p className="text-sm text-gray-400">
            Több mint 500 hitelesített profil
          </p>
        </div>
      </div>
      <ChevronRight className="text-gray-600 group-hover:text-[#F6C90E] group-hover:translate-x-2 transition-all" />
    </div>
  );
}
