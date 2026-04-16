import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Award } from "lucide-react";

export default function BrowseInstructors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL paraméterek kiolvasása (amiket a Navbar állít be)
  const searchQuery = searchParams.get("q") || "";
  const cityQuery = searchParams.get("city") || "Minden város";

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adatok lekérése a backendről
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get("http://localhost:3300/api/v1/instructor");
        setInstructors(res.data);
      } catch (error) {
        console.error("Hiba az oktatók betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // Szűrés a Navbarból érkező adatok (név és város) alapján
  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch = inst.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCity =
      cityQuery === "Minden város" ||
      (inst.location || "Budapest") === cityQuery;
    return matchesSearch && matchesCity;
  });

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
      {/* Fejléc és találatok száma */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            Oktatók Böngészése
          </h2>
          <p className="text-gray-400 font-medium">
            Találd meg a számodra legmegfelelőbb autósoktatót!
          </p>
        </div>
        <div className="bg-[#F6C90E]/20 text-[#F6C90E] px-5 py-2 rounded-xl text-sm font-black tracking-widest uppercase border border-[#F6C90E]/20 shadow-lg">
          {filteredInstructors.length} találat
        </div>
      </div>

      {/* Betöltés állapota */}
      {loading ? (
        <div className="w-full flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#F6C90E] rounded-full animate-spin"></div>
        </div>
      ) : filteredInstructors.length === 0 ? (
        /* Üres állapot, ha nincs találat */
        <div className="bg-[#21272D] rounded-3xl p-16 text-center border border-white/5 shadow-2xl flex flex-col items-center">
          <div className="text-6xl mb-6 opacity-80">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">Nincs találat</h3>
          <p className="text-gray-400 text-lg">
            Nem találtunk oktatót a megadott névvel vagy városban.
          </p>
        </div>
      ) : (
        /* Oktatók listázása gridben */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInstructors.map((inst) => (
            <div
              key={inst._id}
              onClick={() => navigate(`/instructor/${inst._id}`)}
              className="bg-[#21272D] border border-white/5 rounded-3xl p-8 hover:border-[#F6C90E]/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer shadow-xl group relative overflow-hidden flex flex-col items-center">
              {/* Kiemelt oktató jelvény */}
              {inst.isFeatured && (
                <div className="absolute top-0 right-0 bg-[#F6C90E] text-black text-[10px] font-black px-4 py-1.5 rounded-bl-xl z-10 flex items-center gap-1 uppercase tracking-widest shadow-md">
                  <Award size={14} /> Kiemelt
                </div>
              )}

              {/* Profilkép helye */}
              <div className="w-24 h-24 bg-[#1A1F25] rounded-full mb-5 border-4 border-white/5 group-hover:border-[#F6C90E] transition-colors flex items-center justify-center overflow-hidden shadow-inner">
                <span className="text-xs text-gray-500 font-medium">
                  Nincs kép
                </span>
              </div>

              {/* Oktató neve */}
              <h4 className="text-center font-black text-xl text-white mb-2 group-hover:text-[#F6C90E] transition-colors">
                {inst.name}
              </h4>

              {/* Város */}
              <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mb-6 font-medium bg-black/20 px-3 py-1.5 rounded-full">
                <MapPin size={16} className="text-[#F6C90E]" />{" "}
                {inst.location || "Budapest"}
              </div>

              {/* Iskola neve */}
              <div className="w-full bg-white/5 rounded-xl p-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                {inst.schools?.[0]?.name || inst.schools?.[0] || "Autósiskola"}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
