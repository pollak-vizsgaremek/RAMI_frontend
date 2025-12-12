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
    color: "from-orange-500 to-red-600",
  },
  {
    name: "TEST 2",
    area: "Debrecen",
    desc: "Izgulós tanulókra és automata autókra specializálódott.",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "TEST 3",
    area: "Szeged",
    desc: "A legmagasabb elsőre sikeres vizsgázási arány a régióban.",
    color: "from-emerald-500 to-teal-600",
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

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
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
            <button className="w-fit bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold active:scale-95">
              Profil megtekintése
            </button>
          </div>
        </div>

        {/* 2. Widget: Vélemény */}
        <div
          className={`bg-amber-50 rounded-3xl p-6 border border-amber-100 flex flex-col justify-center transition-all duration-500 
          ${layoutIdx === 1 ? "md:col-span-2" : "md:col-span-1"}
          ${
            isRefreshing
              ? "opacity-0 -translate-y-4"
              : "opacity-100 translate-y-0"
          }`}>
          <Quote className="text-amber-400 mb-2" size={24} />
          <p className="text-gray-800 italic font-medium text-sm mb-4">
            "{reviewsPool[index % 3].text}"
          </p>
          <span className="font-bold text-gray-900 text-xs">
            — {reviewsPool[index % 3].user}
          </span>
        </div>

        {/* 3. Widget: Élő statisztika */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
          <Activity className="text-emerald-500 mb-2 animate-pulse" size={24} />
          <h5 className="text-2xl font-black text-emerald-900 tabular-nums">
            {onlineCount}
          </h5>
          <p className="text-[10px] text-emerald-700 uppercase font-bold">
            Oktató online
          </p>
        </div>

        {/* 4. Widget: Legjobb Iskolák */}
        <div
          className={`bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col justify-between transition-all duration-500
          ${layoutIdx === 2 ? "md:col-span-2" : "md:col-span-1"}
          ${
            isRefreshing
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}>
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-orange-500" size={16} /> Top Iskolák
          </h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 bg-white p-2 rounded-lg">
              <span>SafeDrive Akadémia</span>
              <span className="text-orange-500">4.9★</span>
            </div>
          </div>
        </div>

        {/* 5. Widget: Népszerű környékek */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-center transition-all duration-500">
          <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
            <MapPin size={14} className="text-red-500" /> Felkapott városok
          </h5>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {areasPool.slice(0, 4).map((area) => (
              <span
                key={area}
                className="text-[9px] bg-gray-100 px-2 py-1 rounded-full font-bold">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Widget: Sikeres vizsgák */}
        <div className="bg-black text-white rounded-3xl p-6 flex flex-col justify-center items-center text-center">
          <TrendingUp className="text-green-400 mb-1" size={24} />
          <h5 className="text-2xl font-black tabular-nums">2,482</h5>
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            Sikeres vizsga
          </p>
        </div>

        {/* 7. Widget: Közösség */}
        <div className="bg-linear-to-tr from-purple-500 to-pink-500 text-white rounded-3xl p-6 flex flex-col justify-between group cursor-pointer">
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
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-center group cursor-pointer hover:bg-gray-900 hover:text-white transition-all">
          <BookOpen
            className="text-orange-500 mb-2 group-hover:text-white"
            size={20}
          />
          <h5 className="font-bold text-sm">Pro Tippek</h5>
          <p className="text-[10px] text-gray-500 group-hover:text-gray-400">
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
          border-gray-200 hover:border-orange-400 hover:bg-orange-50 group cursor-pointer`}>
          <Search
            className="text-gray-400 mb-2 group-hover:text-orange-500 transition-all"
            size={24}
          />
          <h5 className="font-bold text-sm text-gray-800">
            Találd meg az igazit
          </h5>
          <ChevronRight
            className="mt-1 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
            size={16}
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoveryGrid;
