import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function BrowseInstructorsWidget() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/browse-instructors")}
      className="cursor-pointer hover:scale-[1.02] transition-transform h-full w-full rounded-2xl overflow-hidden bg-linear-to-br from-[#F6C90E] to-[#D4AC0D] shadow-md flex flex-col items-center justify-center relative group">
      <div className="z-10 bg-black text-[#F6C90E] rounded-full p-3 mb-2 group-hover:rotate-12 transition-transform shadow-lg">
        <Search size={24} />
      </div>

      <h3 className="text-black font-black text-lg z-10 text-center leading-tight uppercase tracking-wide">
        Oktatók
        <br />
        Böngészése
      </h3>

      <div className="absolute right-0 top-0 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
    </div>
  );
}
