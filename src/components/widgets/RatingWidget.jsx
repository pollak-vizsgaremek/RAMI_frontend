import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { api } from "../../services/api/authService";

export default function RatingWidget() {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateAverage = async () => {
      try {
        const response = await api.get("/reviews");
        
        // Extract ratings and calculate average
        const ratings = response.data?.map((review) => review.rating) || [];
        const average =
          ratings.length > 0
            ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
            : 0;

        setAverageRating(average);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateAverage();
  }, []);

  return (
    <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner hover:scale-[1.02] duration-300">
      <TrendingUp className="text-[#F6C90E] mb-1" size={28} />
      <span className="text-2xl font-black text-white">
        {loading ? "-" : averageRating}
      </span>
      <p className="text-[9px] uppercase font-bold text-gray-500">
        Átlagos Értékelés
      </p>
    </div>
  );
}
