import React, { useState, useEffect } from "react";
import { CloudSun, Wind, Droplets, Loader2, MapPin } from "lucide-react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL;

console.log("My API Key is:", API_KEY); // This should show your key in the browser console

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Check if user allows location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("A hely hozzáférése megtagadva");
          setLoading(false);
        },
      );
    } else {
      setError("A geolokalizáció nem támogatott");
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API kulcs érvénytelen vagy lejárt");
        }
        throw new Error("Időjárás adatok nem találhatók");
      }
      const data = await response.json();
      setWeather(data);
    } catch {
      setError("Hiba az időjárás betöltésekor");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format temp without decimals
  const formatTemp = (temp) => Math.round(temp);

  if (loading) {
    return (
      <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 text-white shadow-2xl border border-white/10 flex items-center justify-center h-48 w-full">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 text-white shadow-2xl border border-white/10 h-48 flex flex-col items-center justify-center gap-2">
        <MapPin className="text-red-400" size={24} />
        <p className="text-sm font-bold text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between group transition-all hover:scale-[1.02] duration-300">
      {/* Background Elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 opacity-10 blur-3xl group-hover:opacity-15 transition-opacity duration-500"></div>

      <div className="flex justify-between items-start z-10">
        <div>
          <span
            id="city"
            className="text-gray-500 text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-md block w-fit mb-1">
            {weather?.name || "Ismeretlen"}
          </span>
          <h3
            id="temp"
            className="text-3xl font-black text-white tracking-tight">
            {weather ? `${formatTemp(weather.main.temp)}°C` : "--"}
          </h3>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-yellow-400 shadow-inner">
          {/* You can swap this icon dynamically based on weather.weather[0].main if desired */}
          <CloudSun size={24} />
        </div>
      </div>

      <div className="z-10 mt-6">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
          Jelenlegi feltételek
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
            <Wind size={12} className="text-[#F6C90E]" />
            <span id="wind" className="text-[10px] font-bold">
              {weather ? Math.round(weather.wind.speed * 3.6) : 0} km/h
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
            <Droplets size={12} className="text-blue-400" />
            <span id="humidity" className="text-[10px] font-bold">
              {weather ? weather.main.humidity : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
