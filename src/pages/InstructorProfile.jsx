import React, { useState, Suspense, lazy } from "react";
import Navbar from "../components/Navbar.jsx";

const LoginPage = lazy(() => import("./Login.jsx"));
const RegisterPage = lazy(() => import("./Register.jsx"));

export default function InstructorProfile() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col">
        <div className="w-full rounded-[32px] p-8 md:p-12 transition-all duration-500 bg-linear-to-br from-[#1A1F25] to-[#303841] border border-white/10 shadow-2xl relative text-white overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C90E] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 lg:col-span-4 flex flex-col">
              <div className="w-full aspect-4/3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center text-gray-400">
                  <span className="font-medium text-sm">Profilkép helye</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-start">
              <div className="mb-6">
                <span className="bg-[#F6C90E]/20 text-[#F6C90E] border border-[#F6C90E]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                  Oktató
                </span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-2">
                  Kovács Zoltán
                </h2>
                <p className="opacity-90 font-medium text-gray-400 text-lg">
                  42 éves
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Iskola
                  </h4>
                  <p className="font-medium text-white text-lg">
                    Szupi Autósiskola
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Tapasztalat
                  </h4>
                  <p className="font-medium text-white text-lg">15 éve tanít</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Hobbik
                  </h4>
                  <p className="font-medium text-white text-lg">
                    Túrázás, kerékpározás, fotózás
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="w-full md:w-2/3 flex flex-col gap-5">
              <h3 className="text-xl font-bold text-white px-1">
                Elérhetőségek
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    E-mail
                  </h4>
                  <a
                    href="mailto:zoltan.kovacs@example.com"
                    className="font-medium text-[#F6C90E] hover:underline text-lg transition-all break-all drop-shadow-md"
                  >
                    zoltan.kovacs@example.com
                  </a>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Telefon
                  </h4>
                  <a
                    href="tel:+36301234567"
                    className="font-medium text-white hover:text-[#F6C90E] transition-colors text-lg"
                  >
                    +36 30 123 4567
                  </a>
                </div>
              </div>
            </div>

            <button className="whitespace-nowrap w-full md:w-auto bg-[#F6C90E] text-black px-8 py-4 rounded-2xl font-black uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F6C90E]/20 hover:shadow-[#F6C90E]/40 text-sm">
              Kapcsolatfelvétel
            </button>
          </div>
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
