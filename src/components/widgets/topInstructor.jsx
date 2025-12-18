import React from "react";

export default function TopInstructor({ instr, isVisible }) {
  return (
    <div
      className={`md:col-span-2 md:row-span-2 rounded-4xl p-8 flex flex-col justify-between transition-all duration-500 bg-linear-to-br ${
        instr.color
      } shadow-2xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
      <div>
        <span className="bg-black/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Kiemelt
        </span>
        <h3 className="text-4xl font-black mt-6 leading-tight">{instr.name}</h3>
        <p className="mt-4 opacity-90 max-w-xs font-medium">{instr.desc}</p>
      </div>
      <button className="w-fit bg-black text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
        Profil megtekintése
      </button>
    </div>
  );
}
