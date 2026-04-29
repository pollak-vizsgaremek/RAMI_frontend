import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

const TIPS = [
  "Kanyarodás: Lassíts le, majd egyenletes gázzal haladj tovább.",
  "Holttér: Sávváltás előtt nézz a tükörbe majd hátra a vállad felett.",
  "Dugó: Ne váltogass sávot folyamatosan, túl nagy kockázat.",
  "Vészfékezés: ABS-es autóban nyomj a fékre és kuplungra egyszerre.",
  "Turbó: Autó pályás vezetés után ne állítsd le az autót azonnal, hagyd 1-2 percig járni.",
  "Klíma: Havonta kapcsold be télen is, hogy a tömítések ne száradjanak ki.",
  "Tank: Ne várd meg, hogy teljesen kiürüljön, az üledék károsíthatja a motort.",
  "Akkumulátor: Hosszabb utak után jól feltöltödik a generátor.",
  "Éjszaka: Rágózás segít éberen tartani az agyat vezetéskor.",
  "Jégmentesítés: Ne forró vizet, csak meleg vagy ecetes oldatot használj.",
  "Ismerd meg az autót: Mielőtt elindulsz, tanulmányozd az utastérben található gombokat.",
  "Figyeld a forgalmat és a tükröket: Használd folyamatosan a visszapillantó tükröket",
  "Ne engedd, hogy mások siettetése befolyásoljon: Ha valaki nyomást gyakorol rád, maradj a saját, biztonságos tempódban"

];

export default function TipsAndTricksWidget() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div className="bg-[#3A4750] rounded-4xl p-6 flex flex-col items-start justify-between border border-white/5 shadow-lg hover:scale-[1.02] duration-300">
      <div className="flex items-start gap-3 mb-3">
        <Lightbulb className="text-[#F6C90E] flex-shrink-0 mt-1" size={12} />
        <p className="text-[12px] uppercase font-bold text-gray-400">
          Tippek & Trükkök
        </p>
      </div>
      
      <p className="text-sm text-gray-200 leading-relaxed mb-4 flex-grow">
        {TIPS[currentTipIndex]}
      </p>

      <div className="flex items-center justify-between w-full">
        <span className="text-xs text-gray-400">
          {currentTipIndex + 1} / {TIPS.length}
        </span>
        <button
          onClick={handleNextTip}
          className="transition-transform hover:scale-125"
          aria-label="Következő tipp"
        >
          <ChevronRight className="text-[#F6C90E]" size={18} />
        </button>
      </div>
    </div>
  );
}
