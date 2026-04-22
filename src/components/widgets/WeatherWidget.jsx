import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Loader2,
  MapPin,
  EyeIcon,
  Cloud,
  CloudRain,
  Sun,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL;

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Hozzáférés megtagadva");
          setLoading(false);
        },
      );
    } else {
      setError("Nem támogatott");
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      if (!response.ok) throw new Error("Hiba");
      const data = await response.json();
      setWeather(data);

      const forecastResponse = await fetch(
        `${API_URL.replace("/weather", "/forecast")}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      }
    } catch {
      setError("Hiba");
    } finally {
      setLoading(false);
    }
  };

  const formatTemp = (temp) => Math.round(temp);

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <Sun size={14} className="text-yellow-400" />;
      case "clouds":
        return <Cloud size={14} className="text-gray-400" />;
      case "rain":
        return <CloudRain size={14} className="text-blue-400" />;
      default:
        return <CloudSun size={14} className="text-yellow-400" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || error) {
    return (
      <div className="md:col-span-2 md:row-span-2 bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-8 border border-white/10 flex flex-col items-center justify-center text-center">
        {loading ? (
          <Loader2 className="animate-spin text-[#F6C90E]" size={32} />
        ) : (
          <>
            <MapPin className="text-red-400 mb-2" size={24} />
            <p className="text-xs font-bold text-red-200 uppercase tracking-tighter">
              {error}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="md:col-span-2 md:row-span-2 bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-4 md:p-6 text-white shadow-xl border border-white/10 relative overflow-hidden flex flex-col group transition-all duration-300">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] -mr-10 -mt-10 opacity-10 pointer-events-none"></div>

      {/* Header: City & Main Icon */}
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-md inline-block mb-0.5 truncate max-w-full">
            {weather?.name}
          </span>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              {formatTemp(weather.main.temp)}°
            </h3>
            <span className="text-[#F6C90E] text-xs font-bold uppercase truncate">
              {weather.weather[0].main}
            </span>
          </div>
        </div>
        <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
          <CloudSun size={24} className="text-[#F6C90E]" />
        </div>
      </div>

      {/* Stats Grid: More compact */}
      <div className="relative z-10 grid grid-cols-3 gap-2 mb-2">
        <div className="flex flex-col items-center gap-1 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
          <Wind size={16} className="text-[#F6C90E]" />
          <span className="text-xs font-bold leading-none">
            {Math.round(weather.wind.speed * 3.6)}
          </span>
          <span className="text-[7px] opacity-50 uppercase font-black tracking-wider">
            km/h
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
          <Droplets size={16} className="text-blue-400" />
          <span className="text-xs font-bold leading-none">
            {weather.main.humidity}%
          </span>
          <span className="text-[7px] opacity-50 uppercase font-black tracking-wider">
            Pára
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
          <EyeIcon size={16} className="text-red-400" />
          <span className="text-xs font-bold leading-none">
            {(weather.visibility / 1000).toFixed(0)}
          </span>
          <span className="text-[7px] opacity-50 uppercase font-black tracking-wider">km</span>
        </div>
      </div>

      {/* Forecast Section: Optimized for vertical space */}
      {forecast && (
        <div className="relative z-10 mt-1 pt-2 border-t border-white/10 flex-1 flex flex-col">
          <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-[0.15em]">
            24 Órás Előrejelzés
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {forecast.list?.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1.5 shrink-0 min-w-[50px]">
                <span className="text-[8px] font-bold text-gray-400">
                  {formatTime(item.dt)}
                </span>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  {getWeatherIcon(item.weather[0].main)}
                </div>
                <span className="text-[9px] font-black leading-none">
                  {formatTemp(item.main.temp)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
