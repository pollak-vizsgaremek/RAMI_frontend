import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { api } from "../../services/api/authService";

export default function RatingWidget() {
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await api.get("/review");
        setTotalReviews(response.data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewCount();
  }, []);

  return (
    <div className="bg-[#303841] rounded-4xl p-6 flex flex-col items-center justify-center border border-white/5 shadow-inner hover:scale-[1.02] duration-300">
      <MessageSquare className="text-[#F6C90E] mb-1" size={28} />
      <span className="text-2xl font-black text-white">
        {loading ? "-" : totalReviews}
      </span>
      <p className="text-[12px] uppercase font-bold m-2 text-gray-400">
        Összes Értékelés
      </p>
    </div>
  );
}
