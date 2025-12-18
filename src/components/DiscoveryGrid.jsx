import React, { useState, useEffect } from "react";
import {
  MapPin,
  TrendingUp,
  Quote,
  Search,
  Activity,
  ChevronRight,
  Navigation,
} from "lucide-react";

// Hivatalos KAV vizsgaközpontok és forgalmi vizsgahelyszínek koordinátákkal
const EXAM_CENTERS = [
  {
    name: "Budapest (Petzvál J. u.)",
    lat: 47.4665,
    lng: 19.0305,
    type: "Központi",
  },
  {
    name: "Budapest (Vas Gereben u.)",
    lat: 47.4508,
    lng: 19.1542,
    type: "Forgalmi",
  },
  {
    name: "Budapest (Mozaik u.)",
    lat: 47.5451,
    lng: 19.0435,
    type: "Forgalmi",
  },
  {
    name: "Budapest (Budaörsi út)",
    lat: 47.4628,
    lng: 18.9958,
    type: "Forgalmi",
  },
  {
    name: "Kecskemét (Szent István krt.)",
    lat: 46.9146,
    lng: 19.7118,
    type: "Vármegyei",
  },
  {
    name: "Pécs (Hengermalom u.)",
    lat: 46.0505,
    lng: 18.2393,
    type: "Vármegyei",
  },
  {
    name: "Békéscsaba (Szarvasi út)",
    lat: 46.6749,
    lng: 21.0747,
    type: "Vármegyei",
  },
  {
    name: "Miskolc (József A. u.)",
    lat: 48.0991,
    lng: 20.8091,
    type: "Vármegyei",
  },
  {
    name: "Szeged (Kereskedő köz)",
    lat: 46.2556,
    lng: 20.1017,
    type: "Vármegyei",
  },
  {
    name: "Székesfehérvár (Sárkeresztúri u.)",
    lat: 47.1683,
    lng: 18.4239,
    type: "Vármegyei",
  },
  { name: "Győr (Tatai út)", lat: 47.6756, lng: 17.6533, type: "Vármegyei" },
  {
    name: "Debrecen (Széchenyi u.)",
    lat: 47.5284,
    lng: 21.6198,
    type: "Vármegyei",
  },
  {
    name: "Eger (Töviskes tér)",
    lat: 47.9172,
    lng: 20.3668,
    type: "Vármegyei",
  },
  {
    name: "Szolnok (Indóház út)",
    lat: 47.1691,
    lng: 20.1837,
    type: "Vármegyei",
  },
  {
    name: "Tatabánya (Táncsics M. út)",
    lat: 47.5818,
    lng: 18.3976,
    type: "Vármegyei",
  },
  {
    name: "Salgótarján (Karancs út)",
    lat: 48.0933,
    lng: 19.7892,
    type: "Vármegyei",
  },
  {
    name: "Kaposvár (Vásártéri u.)",
    lat: 46.3638,
    lng: 17.8016,
    type: "Vármegyei",
  },
  {
    name: "Nyíregyháza (Törzs u.)",
    lat: 47.9545,
    lng: 21.7247,
    type: "Vármegyei",
  },
  {
    name: "Szekszárd (Pásztor u.)",
    lat: 46.3478,
    lng: 18.7061,
    type: "Vármegyei",
  },
  {
    name: "Szombathely (Wesselényi u.)",
    lat: 47.2307,
    lng: 16.6218,
    type: "Vármegyei",
  },
  {
    name: "Veszprém (Kistó u.)",
    lat: 47.0941,
    lng: 17.9122,
    type: "Vármegyei",
  },
  {
    name: "Zalaegerszeg (Zrínyi M. u.)",
    lat: 46.8443,
    lng: 16.8436,
    type: "Vármegyei",
  },
];

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

  // Helymeghatározás állapotai
  const [nearestCenter, setNearestCenter] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

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

  // Távolság számítása (Haversine formula)
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

  const findNearestCenter = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert("A böngésződ nem támogatja a helymeghatározást.");
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = null;
        let minDistance = Infinity;

        EXAM_CENTERS.forEach((center) => {
          const dist = calculateDistance(
            latitude,
            longitude,
            center.lat,
            center.lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            closest = { ...center, distance: dist.toFixed(1) };
          }
        });

        setNearestCenter(closest);
        setLocLoading(false);
      },
      () => {
        alert("Engedélyezned kell a hozzáférést a helyzetedhez a kereséshez!");
        setLocLoading(false);
      }
    );
  };

  const instr = instructorsPool[index];

  return (
    <section className="max-w-7xl mx-auto px-6 w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4">
        {/* Kiemelt Oktató Widget */}
        

        {/* MODERNEBB Vizsgaközpont Kereső Widget */}
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
              onClick={findNearestCenter}
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

        {/* Vélemény Widget */}
        <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-center border border-white/5 shadow-lg">
          <Quote className="text-[#F6C90E] mb-3" size={24} />
          <p className="italic text-sm text-[#EEEEEE] line-clamp-3">
            "{reviewsPool[index % 3].text}"
          </p>
          <span className="mt-3 text-[#F6C90E] font-bold text-xs">
            — {reviewsPool[index % 3].user}
          </span>
        </div>

        {/* Online Állapot Widget */}
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

        {/* Statisztika Widget */}
        <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner">
          <TrendingUp className="text-[#F6C90E] mb-1" size={28} />
          <span className="text-2xl font-black text-white">2,482</span>
          <p className="text-[9px] uppercase font-bold text-gray-500">
            Sikeres Vizsga
          </p>
        </div>

        {/* Városok Widget */}
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

        {/* Keresés CTA */}
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
        <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner">
        <TrendingUp className="text-[#F6C90E] mb-1" size={28} />
        <span className="text-2xl font-black text-white">4.7</span>
        <p className="text-[9px] uppercase font-bold text-gray-500">
          Átlagos Értékelés
        </p>
      </div>
      </div>

      
    </section>
  );
}
