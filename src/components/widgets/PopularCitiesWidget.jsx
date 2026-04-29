import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { api } from "../../services/api/authService.js";

export default function PopularCitiesWidget() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/instructor/cities`)
      .then(res => {
        setCities(res.data);
      })
      .catch(err => {
        console.error("Hiba a városok betöltésekor:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="row-span-2 bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-start border border-white/5 overflow-hidden">
      <h5 className="font-bold text-[14px] text-gray-400 uppercase mb-6 flex items-center gap-2">
        <MapPin size={16} className="text-[#F6C90E]" /> Oktatók Városonként
      </h5>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-gray-400 text-sm text-center mt-4">Betöltés...</div>
        ) : cities.length === 0 ? (
          <div className="text-gray-400 text-sm text-center mt-4">Nincs elérhető adat</div>
        ) : (
          cities.map((city, idx) => (
            <div
              key={city.name}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-center min-w-8 h-8 rounded-lg bg-black/40 border border-[#F6C90E]/30 group-hover:border-[#F6C90E]/60 group-hover:shadow-lg group-hover:shadow-[#F6C90E]/50 transition-all">
                <span className="font-black text-[#F6C90E] text-sm">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{city.name}</p>
                <p className="text-[12px] text-gray-200">{city.count} oktató</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
