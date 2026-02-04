import React from "react";
import { BookOpen, User, Phone, Download } from "lucide-react";

const actions = [
  {
    icon: BookOpen,
    label: "Vizsga",
    color: "text-[#F6C90E]",
    bg: "bg-white/5 hover:bg-[#F6C90E] hover:text-black",
  },
  {
    icon: Download,
    label: "Anyagok",
    color: "text-emerald-400",
    bg: "bg-white/5 hover:bg-emerald-400 hover:text-black",
  },
  {
    icon: User,
    label: "Profil",
    color: "text-purple-400",
    bg: "bg-white/5 hover:bg-purple-400 hover:text-black",
  },
  {
    icon: Phone,
    label: "Kapcsolat",
    color: "text-blue-400",
    bg: "bg-white/5 hover:bg-blue-400 hover:text-black",
  },
];

export default function QuickActionsWidget() {
  return (
    <div className="md:col-span-2 bg-linear-to-br from-[#1A1F25] to-[#303841] rounded-4xl p-6 shadow-2xl border border-white/10 flex flex-col justify-center relative overflow-hidden group">
      <div className="absolute -left-10 bottom-0 w-32 h-32 bg-[#F6C90E] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-white font-bold text-sm flex items-center gap-2 tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F6C90E]"></span>
          Gyorsműveletek
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 group/btn border border-white/5 ${action.bg}`}>
            <action.icon
              size={20}
              className={`${action.color} transition-colors group-hover/btn:text-inherit`}
            />
            <span className="text-[10px] font-bold text-gray-400 group-hover/btn:text-inherit uppercase tracking-wide transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
