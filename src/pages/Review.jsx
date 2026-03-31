import React, { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "../components/Navbar.jsx";

const LoginPage = lazy(() => import("./Login.jsx"));
const RegisterPage = lazy(() => import("./Register.jsx"));

export default function Review() {
  const [turelem, setTurelem] = useState(0);
  const [turelемHover, setTurelемHover] = useState(0);

  const [szaktudas, setSzaktudas] = useState(0);
  const [szaktudasHover, setSzaktudasHover] = useState(0);

  const [kommunikacio, setKommunikacio] = useState(0);
  const [kommunikacioHover, setKommunikacioHover] = useState(0);

  const [rugalmasag, setRugalmasag] = useState(0);
  const [rugalmasagHover, setRugalmasagHover] = useState(0);

  const [tapasztalat, setTapasztalat] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [Oktatok, setOktatok] = useState([]);
  
  function getOktatok() {
    fetch("http://localhost:3300/api/v1/instructor/").then(async (res) => {
      const data = await res.json();
      setOktatok(data);
    });
  }
  useEffect(() => {
    getOktatok();
  }, []);

  const resetRatings = () => {
    setTurelem(0);
    setTurelемHover(0);
    setSzaktudas(0);
    setSzaktudasHover(0);
    setKommunikacio(0);
    setKommunikacioHover(0);
    setRugalmasag(0);
    setRugalmasagHover(0);
    setTapasztalat("");
  };

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col">
        <div data-aos="fade-down" className="w-full rounded-4xl p-8 md:p-12 transition-all duration-500 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group">
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
            className="relative z-10 flex flex-col gap-3"
            onSubmit={(e) => e.preventDefault()}>
            {/* <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                Összesített értékelés
              </label> */}
            {/* <div className="flex gap-2">
                {[1, 2, 3, 4, 5,6,7,8,9,10].map((star) => (
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
                    }`}>
                    ★
                  </button>
                ))}
              </div> */}
            {/* </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Oktató
                </label>
                <select
                  id="oktato_mezo"
                  className="w-full bg-[#21272D] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected>
                    Válassz egy oktatót
                  </option>
                  {Oktatok.map((oktato) => (
                    <option key={oktato._id} value={oktato._id}>
                      {oktato.name}
                    </option>
                  ))}
                </select>
              </div>
              <div></div>
            </div>

            {/* Türelem értékelése */}

            {/* Türelem értékelése */}
            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Türelem:
              </label>
              <div className="flex gap-4 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTurelem(star)}
                    onMouseEnter={() => setTurelемHover(star)}
                    onMouseLeave={() => setTurelемHover(turelem)}
                    className={`w-8 h-8 flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                      star <= (turelемHover || turelem)
                        ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]"
                        : "text-gray-600"
                    }`}>
                    ★
                  </button>
                ))}
              </div>
              <div className="flex gap-4 text-center text-sm text-gray-400">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <span
                    key={`label-${star}`}
                    className="w-8 flex justify-center">
                    {star}
                  </span>
                ))}
              </div>
            </div>

            {/* Szaktudás értékelése */}
            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Szaktudás:
              </label>
              <div className="flex gap-4 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSzaktudas(star)}
                    onMouseEnter={() => setSzaktudasHover(star)}
                    onMouseLeave={() => setSzaktudasHover(szaktudas)}
                    className={`w-8 h-8 flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                      star <= (szaktudasHover || szaktudas)
                        ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]"
                        : "text-gray-600"
                    }`}>
                    ★
                  </button>
                ))}
              </div>
              <div className="flex gap-4 text-center text-sm text-gray-400">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <span
                    key={`label-${star}`}
                    className="w-8 flex justify-center">
                    {star}
                  </span>
                ))}
              </div>
            </div>

            {/* Kommunikáció értékelése */}
            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Kommunikáció:
              </label>
              <div className="flex gap-4 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setKommunikacio(star)}
                    onMouseEnter={() => setKommunikacioHover(star)}
                    onMouseLeave={() => setKommunikacioHover(kommunikacio)}
                    className={`w-8 h-8 flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                      star <= (kommunikacioHover || kommunikacio)
                        ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]"
                        : "text-gray-600"
                    }`}>
                    ★
                  </button>
                ))}
              </div>
              <div className="flex gap-4 text-center text-sm text-gray-400">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <span
                    key={`label-${star}`}
                    className="w-8 flex justify-center">
                    {star}
                  </span>
                ))}
              </div>
            </div>

            {/* Rugalmaság értékelése */}
            <div className="mb-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                Rugalmaság:
              </label>
              <div className="flex gap-4 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRugalmasag(star)}
                    onMouseEnter={() => setRugalmasagHover(star)}
                    onMouseLeave={() => setRugalmasagHover(rugalmasag)}
                    className={`w-8 h-8 flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                      star <= (rugalmasagHover || rugalmasag)
                        ? "text-[#F6C90E] drop-shadow-[0_0_8px_rgba(246,201,14,0.5)]"
                        : "text-gray-600"
                    }`}>
                    ★
                  </button>
                ))}
              </div>
              <div className="flex gap-4 text-center text-sm text-gray-400">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <span
                    key={`label-${star}`}
                    className="w-8 flex justify-center">
                    {star}
                  </span>
                ))}
              </div>
            </div>
            <br />
            <div>
              <label className="text-s font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Tapasztalatod
              </label>
              <textarea
                maxLength={200}
                rows="5"
                placeholder="Írd ide..."
                value={tapasztalat}
                onChange={(e) => setTapasztalat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-all resize-none"></textarea>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
              <button
                type="button"
                onClick={resetRatings}
                className="whitespace-nowrap w-full md:w-auto bg-gray-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-600/20 hover:shadow-gray-600/40 text-sm cursor-pointer">
                Visszaállítás
              </button>
              <button
                type="submit"
                className="whitespace-nowrap w-full md:w-auto bg-[#F6C90E] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 text-sm cursor-pointer">
                Beküldés
              </button>
            </div>
          </form>
        </div>
      </main>
      <Suspense fallback={null}>
        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <RegisterPage
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
      </Suspense>
    </>
  );
}
