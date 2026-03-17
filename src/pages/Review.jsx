import React, { useState } from "react";

export default function Review() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <>
      <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col">
        <div className="w-full rounded-4xl p-8 md:p-12 transition-all duration-500 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500 pointer-events-none"></div>

          {/* Header Section */}
          <div className="relative z-10 mb-8 pb-6 border-b border-white/10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2">
              Értékelés
            </h2>
            <p className="opacity-90 font-medium text-gray-400 text-lg">
              Oszd meg a tapasztalataidat...
            </p>
          </div>

          <form
            className="relative z-10 flex flex-col gap-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                Összesített értékelés
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                    className={`text-4xl transition-all hover:scale-110 active:scale-95 ${
                      star <= (hover || rating)
                        ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]"
                        : "text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Oktató
                </label>
                <select className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all appearance-none">
                  <option value="" disabled selected>
                    Válassz egy oktatót
                  </option>
                  {/** .map() oktatók lekérdezése  */}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Kommunikáció
                </label>
                <select className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all appearance-none">
                  <option value="" disabled selected>
                    Válassz egy lehetőséget
                  </option>
                  <option value="excellent">Tökéletes</option>
                  <option value="good">Jó</option>
                  <option value="average">Átlagos</option>
                  <option value="poor">Nem megfelelő</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Tapasztalatod
              </label>
              <textarea
                rows="5"
                placeholder="Írd ide..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="whitespace-nowrap w-full md:w-auto bg-[#F6C90E] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 text-sm"
              >
                Beküldés
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
