import React, { useState, useEffect } from "react";
import {
  MapPin,
  TrendingUp,
  Quote,
  Search,
  Activity,
  ChevronRight,
} from "lucide-react";

const instructorsPool = [
  {
    name: "Kovács János",
    area: "Észak-Budapest",
    desc: "Manuális váltós és intenzív tanfolyamok szakértője.",
    color: "from-[#F6C90E] to-[#E2B80D] text-black",
  },
  {
    name: "Nagy Emese",
    area: "Debrecen",
    desc: "Izgulós tanulókra és automata autókra specializálódott.",
    color: "from-[#3A4750] to-[#2A343A] text-white border border-white/10",
  },
  {
    name: "Tóth Bence",
    area: "Szeged",
    desc: "A legmagasabb elsőre sikeres vizsgázási arány a régióban.",
    color: "from-black to-[#303841] text-white border border-white/5",
  },
];

const reviewsPool = [
  { user: "G. Liam", text: "Elsőre átmentem! A türelme páratlan." },
  { user: "W. Emma", text: "Az intenzív tanfolyam kemény volt, de megérte." },
  { user: "K. Noel", text: "Már az első órától kezdve megnyugtatott." },
];

export default function DiscoveryGrid() {
  const [index, setIndex] = useState(0);
  const [onlineCount, setOnlineCount] = useState(142);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % instructorsPool.length);
        setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
        setIsVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const instr = instructorsPool[index];

  return (
    <section className="max-w-7xl mx-auto px-6 w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4">
        {/* Hero Widget */}
        <div
          className={`md:col-span-2 md:row-span-2 rounded-4xl p-8 flex flex-col justify-between transition-all duration-500 bg-linear-to-br ${
            instr.color
          } shadow-2xl ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
          <div>
            <span className="bg-black/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Kiemelt
            </span>
            <h3 className="text-4xl font-black mt-6 leading-tight">
              {instr.name}
            </h3>
            <p className="mt-4 opacity-90 max-w-xs font-medium">{instr.desc}</p>
          </div>
          <button className="w-fit bg-black text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
            Profil megtekintése
          </button>
        </div>

        {/* Dynamic Review */}
        <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-center border border-white/5 shadow-lg">
          <Quote className="text-[#F6C90E] mb-3" size={24} />
          <p className="italic text-sm text-[#EEEEEE] line-clamp-3">
            "{reviewsPool[index % 3].text}"
          </p>
          <span className="mt-3 text-[#F6C90E] font-bold text-xs">
            — {reviewsPool[index % 3].user}
          </span>
        </div>

        {/* Live Status */}
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

        {/* Stats */}
        <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner">
          <TrendingUp className="text-[#F6C90E] mb-1" size={28} />
          <span className="text-2xl font-black text-white">2,482</span>
          <p className="text-[9px] uppercase font-bold text-gray-500">
            Sikeres Vizsga
          </p>
        </div>

        {/* Locations */}
        <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-center border border-white/5">
          <h5 className="font-bold text-[11px] text-gray-400 uppercase mb-3 flex items-center gap-2">
            <MapPin size={12} className="text-[#F6C90E]" /> Népszerű Városok
          </h5>
          <div className="flex flex-wrap gap-2">
            {["Budapest", "Debrecen", "Szeged"].map((city) => (
              <span
                key={city}
                className="bg-[#303841] text-[10px] px-3 py-1 rounded-full font-bold text-[#EEEEEE] border border-white/5">
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Search CTA */}
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
      </div>
    </section>
  );
}
