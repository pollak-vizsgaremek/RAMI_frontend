import React, { useState, useEffect } from "react";
import {
  Star,
  Award,
  Users,
  MapPin,
  TrendingUp,
  Quote,
  BookOpen,
  Search,
  Activity,
  Instagram,
  ChevronRight,
} from "lucide-react";

const instructorsPool = [
  {
    name: "TEST 1",
    area: "Észak-Budapest",
    desc: "Manuális váltós és intenzív tanfolyamok szakértője.",
    // A kiemelt kártyák színeinek módosítása az új palettához
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "TEST 2",
    area: "Debrecen",
    desc: "Izgulós tanulókra és automata autókra specializálódott.",
    color: "from-gray-700 to-gray-900", // Sötétebb átmenet
  },
  {
    name: "TEST 3",
    area: "Szeged",
    desc: "A legmagasabb elsőre sikeres vizsgázási arány a régióban.",
    color: "from-gray-900 to-black",
  },
];

const reviewsPool = [
  {
    user: "G. Liam",
    text: "(név) elsőre átmentem! A türelme páratlan.",
    rating: 5,
  },
  {
    user: "W. Emma",
    text: "Az intenzív tanfolyam kemény volt, de megérte. Csak ajánlani tudom.",
    rating: 5,
  },
  {
    user: "K. Noel",
    text: "(név) már az első órától kezdve megnyugtatott a volán mögött.",
    rating: 4,
  },
];

const areasPool = ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr"];

const DiscoveryGrid = () => {
  const [index, setIndex] = useState(0);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [onlineCount, setOnlineCount] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % instructorsPool.length);
        setLayoutIdx((prev) => (prev + 1) % 3);
        setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
        setIsRefreshing(false);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const instructor = instructorsPool[index];

  // Kódok tárolása a könnyebb használat érdekében
  const accentColor = "#F6C90E"; 
  const darkCardBg = "#3A4750"; // Sötétszürke kártyák
  const deepestBg = "#303841"; // Legmélyebb szürke/fekete

  return (
    // Ezen a ponton adtam hozzá a teljes háttér színátmenetét:
    <section 
        className="max-w-7xl mx-auto px-6 py-12 rounded-lg"
        style={{ backgroundImage: `linear-gradient(to bottom right, ${deepestBg}, ${darkCardBg})`  }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-500">
        
        {/* 1. Widget: Kiemelt Oktató */}
        <div
          className={`relative group overflow-hidden rounded-3xl bg-linear-to-br ${
            instructor.color
          } p-8 text-white shadow-xl transition-all duration-500 
          ${
            layoutIdx === 0
              ? "md:col-span-2 md:row-span-2"
              : "md:col-span-1 md:row-span-2"
          } 
          ${isRefreshing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                Kiemelt
              </span>
              <h3
                className={`${
                  layoutIdx === 0 ? "text-4xl" : "text-2xl"
                } font-black mt-4`}>
                {instructor.name}
              </h3>
              <p className="mt-4 text-white/90 text-sm leading-relaxed">
                {instructor.desc}
              </p>
            </div>
            {/* Gomb sárga színre cserélve */}
            <button 
              className="w-fit text-gray-900 px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-colors" 
              style={{ backgroundColor: accentColor }}>
              Profil megtekintése
            </button>
          </div>
        </div>

        {/* 2. Widget: Vélemény */}
        <div
          className={`rounded-3xl p-6 flex flex-col justify-center transition-all duration-500 text-white`}
          style={{ backgroundColor: darkCardBg }}
          >
          <Quote style={{ color: accentColor }} className="mb-2" size={24} />
          <p className="italic font-medium text-sm mb-4" style={{ color: "#EEEEEE" }}>
            "{reviewsPool[index % 3].text}"
          </p>
          <span className="font-bold text-xs" style={{ color: accentColor }}>
            — {reviewsPool[index % 3].user}
          </span>
        </div>

        {/* 3. Widget: Élő statisztika */}
        <div 
          className="rounded-3xl p-6 flex flex-col justify-center items-center text-center text-white"
          style={{ backgroundColor: darkCardBg }}>
          <Activity style={{ color: accentColor }} className="mb-2 animate-pulse" size={24} />
          <h5 className="text-2xl font-black tabular-nums" style={{ color: accentColor }}>
            {onlineCount}
          </h5>
          <p className="text-[10px] uppercase font-bold text-gray-400">
            Oktató online
          </p>
        </div>

        {/* 4. Widget: Legjobb Iskolák */}
        <div
          className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-500 text-white`}
          style={{ backgroundColor: darkCardBg }}
          >
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Award style={{ color: accentColor }} size={16} /> Top Iskolák
          </h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold bg-white/10 p-2 rounded-lg" style={{ color: "#EEEEEE" }}>
              <span>SafeDrive Akadémia</span>
              <span style={{ color: accentColor }}>4.9★</span>
            </div>
          </div>
        </div>

        {/* 5. Widget: Népszerű környékek */}
        <div 
          className="rounded-3xl p-6 flex flex-col justify-center text-white"
          style={{ backgroundColor: darkCardBg }}>
          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
            <MapPin size={14} style={{ color: accentColor }} /> Felkapott városok
          </h5>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {areasPool.slice(0, 4).map((area) => (
              <span
                key={area}
                className="text-[9px] px-2 py-1 rounded-full font-bold text-white"
                style={{ backgroundColor: deepestBg }}>
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Widget: Sikeres vizsgák */}
        <div 
          className="rounded-3xl p-6 flex flex-col justify-center items-center text-center text-white"
          style={{ backgroundColor: deepestBg }}>
          <TrendingUp style={{ color: accentColor }} className="mb-1" size={24} />
          <h5 className="text-2xl font-black tabular-nums" style={{ color: accentColor }}>2,482</h5>
          <p className="text-[10px] uppercase font-bold text-gray-400">
            Sikeres vizsga
          </p>
        </div>

        {/* 7. Widget: Közösség */}
        {/* Új színek alkalmazása a közösségi kártyára */}
        <div className="bg-gradient-to-tr from-yellow-700 to-amber-900 text-white rounded-3xl p-6 flex flex-col justify-between group cursor-pointer">
          <Instagram
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <div>
            <h5 className="font-bold text-sm">Csatlakozz hozzánk</h5>
            <p className="text-[10px] opacity-80 mt-1">#RateMyInstuctor</p>
          </div>
        </div>

        {/* 8. Widget: Blog/Tippek */}
        <div 
          className="rounded-3xl p-6 flex flex-col justify-center group cursor-pointer hover:bg-black transition-all text-white"
          style={{ backgroundColor: darkCardBg }}>
          <BookOpen
            style={{ color: accentColor }}
            className="mb-2 group-hover:text-white"
            size={20}
          />
          <h5 className="font-bold text-sm">Pro Tippek</h5>
          <p className="text-[10px] text-gray-400">
            Párhuzamos parkolás 3 lépésben...
          </p>
        </div>

        {/* 9. Widget: Keresés CTA */}
        <div
          className={`rounded-3xl p-6 flex flex-col justify-center items-center text-center transition-all duration-500 border-2 border-dashed
          ${
            layoutIdx === 0
              ? "md:col-span-1"
              : layoutIdx === 1
              ? "md:col-span-2"
              : "md:col-span-1"
          }
          border-gray-700 hover:border-yellow-400 hover:bg-gray-700 group cursor-pointer text-white`}>
          <Search
            className="text-gray-400 mb-2 group-hover:text-yellow-500 transition-all"
            size={24}
          />
          <h5 className="font-bold text-sm">
            Találd meg az igazit
          </h5>
          <ChevronRight
            className="mt-1 text-gray-700 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all"
            size={16}
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoveryGrid;