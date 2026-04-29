import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationFinderWidget from "../widgets/LocationFinderWidget.jsx";
import ReviewWidget from "../widgets/ReviewWidget.jsx";
import OnlineStatusWidget from "../widgets/OnlineStatusWidget.jsx";
import StatisticsWidget from "../widgets/StatisticsWidget.jsx";
import PopularCitiesWidget from "../widgets/PopularCitiesWidget.jsx";
import RatingWidget from "../widgets/RatingWidget.jsx";
import BrowseInstructorsWidget from "../widgets/BrowseInstructorsWidget.jsx";
import QuickActionsWidget from "../widgets/QuickActionsWidget.jsx";
import WeatherWidget from "../widgets/WeatherWidget.jsx";
import TopInstructor from "../widgets/topInstructor.jsx";
import TipsAndTricksWidget from "../widgets/TipsAndTricksWidget.jsx";
import { EXAM_CENTERS } from "../widgets/widgetConstants.js";

export default function DiscoveryGrid() {
  const [index, setIndex] = useState(0);
  const [nearestCenter, setNearestCenter] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % 3);
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

  // Top Instructor - dinamikus töltés
  const [topInstr, setTopInstr] = useState({ name: "...", desc: "Betöltés..." });

  useEffect(() => {
    axios.get("http://localhost:3300/api/v1/instructor/top")
      .then((res) => {
        const d = res.data;
        setTopInstr({
          id: d._id,
          name: d.name,
          desc: `${d.city || ""} · ⭐ ${d.averageRating} (${d.reviewCount} értékelés)`,
          profileImage: d.profileImage,
        });
      })
      .catch(() => setTopInstr({ name: "Nincs adat", desc: "Értékelés szükséges" }));
  }, []);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 w-full py-8 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4">
          {/* Row 1 */}
          <TopInstructor instr={topInstr} isVisible={true} />
          <LocationFinderWidget
            nearestCenter={nearestCenter}
            locLoading={locLoading}
            onFindNearest={findNearestCenter}
          />
          <ReviewWidget index={index} />
          <div className="h-full w-full rounded-2xl overflow-hidden shadow-md">
            <BrowseInstructorsWidget />
          </div>

          {/* Row 2 */}
          <RatingWidget />
          <PopularCitiesWidget />
          <WeatherWidget />
          <TipsAndTricksWidget />
        </div>
      </section>
      <QuickActionsWidget />
    </>
  );
}
