import React from "react";
import { Quote } from "lucide-react";
import { reviewsPool } from "./constants";

export default function ReviewWidget({ index }) {
  return (
    <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col justify-center border border-white/5 shadow-lg">
      <Quote className="text-[#F6C90E] mb-3" size={24} />
      <p className="italic text-sm text-[#EEEEEE] line-clamp-3">
        "{reviewsPool[index % 3].text}"
      </p>
      <span className="mt-3 text-[#F6C90E] font-bold text-xs">
        — {reviewsPool[index % 3].user}
      </span>
    </div>
  );
}
