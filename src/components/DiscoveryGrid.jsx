import React, { useState, useEffect } from "react";
import LocationFinderWidget from "./widgets/LocationFinderWidget";
import ReviewWidget from "./widgets/ReviewWidget";
import OnlineStatusWidget from "./widgets/OnlineStatusWidget";
import StatisticsWidget from "./widgets/StatisticsWidget";
import PopularCitiesWidget from "./widgets/PopularCitiesWidget";
import RatingWidget from "./widgets/RatingWidget";
import QuickActionsWidget from "./widgets/QuickActionsWidget";
import WeatherWidget from "./widgets/WeatherWidget";
import TopInstructor from "./widgets/topInstructor";
import { EXAM_CENTERS } from "./widgets/constants";

export default function DiscoveryGrid() {
  const [index, setIndex] = useState(0);
  const [onlineCount, setOnlineCount] = useState(142);
  const [nearestCenter, setNearestCenter] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % 3);
        setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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
            center.lng,
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
      },
    );
  };

  // Sample data for Top Instructor
  const topInstr = {
    name: "Kovács Péter",
    desc: "A hónap kiemelt oktatója kiváló értékelésekkel.",
    color: "from-blue-500 to-purple-600",
  };

  return (
    <section className="max-w-7xl mx-auto px-6 w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4">
        {/* Row 1 */}
        <TopInstructor instr={topInstr} isVisible={true} />
        <LocationFinderWidget
          nearestCenter={nearestCenter}
          locLoading={locLoading}
          onFindNearest={findNearestCenter}
        />
        <ReviewWidget index={index} />
        <OnlineStatusWidget onlineCount={onlineCount} />
        <WeatherWidget />

        {/* Row 2 */}
        <StatisticsWidget />
        <PopularCitiesWidget />
        <RatingWidget />

        {/* Row 3 - Large Items */}
        <div className="md:col-span-2 md:row-span-2"></div>

        {/* Row 4 - Wide items */}
        <QuickActionsWidget />
      </div>
    </section>
  );
}
