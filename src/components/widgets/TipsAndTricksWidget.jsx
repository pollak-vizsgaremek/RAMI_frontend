import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

const TIPS = [
  'Kanyarodás: Fékezz előtte le, majd egyenletes gázzal halad a kanyaron.',
  'Holttér: Sávváltás előtt a tükör mellett nézz hátra a vállad felett.',
  'Dugó: Ne váltogass sávot folyamatosan, túl sok kockázat.',
  'Vészfékezés: ABS-es autóban nyomj a fékre és kuplungra egyszerre.',
  'Turbó: Pálya után ne halj meg azonnal, hagyd 1-2 percig járni.',
  'Klíma: Havonta kapcsold be télen is, hogy a tömítések jók legyenek.',
  'Tank: Ne várd meg, hogy teljesen kiüljön, az üledék gyorsít sérülést.',
  'Akkumulátor: Hosszabb utak után jól feltöltödik a generátor.',
  'Kulcs: A koponyád antenna - érintsd meg a kulcsot, nagyobb lesz a hatótáv.',
  'Éjszaka: Rágózás segít éberen tartani az agyat vezetéskor.',
  'Telefon: Befőttes gumival rá lehet erősíteni a szellőzőrácsra.',
  'Jégmentesítés: Nem forró vizet, csak meleg vagy ecetes oldatot használj.',
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
        <Lightbulb className="text-[#F6C90E] flex-shrink-0 mt-1" size={24} />
        <p className="text-[16px] uppercase font-bold text-gray-400">
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
