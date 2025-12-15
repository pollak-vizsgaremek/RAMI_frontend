import React from "react";
import logo from "../assets/images/RAMI_logo.png";

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const handleLoginClick = () => {
    onLoginClick?.();
  };

  const handleRegisterClick = () => {
    onRegisterClick?.();
  };

  return (
    <nav className="bg-[#3A4750] p-2 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center px-4">
        <div
          className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img
            src={logo}
            alt="RAMI logo"
            className="h-14 w-auto object-contain transition-transform group-hover:rotate-3"
          />
          <span className="font-brand text-white text-xl md:text-2xl font-extrabold tracking-tight">
            Rate My <span className="text-yellow-400">Instructor</span>
          </span>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          <button
            className="relative text-white font-medium transition-all duration-200 hover:text-gray-300 active:scale-95 group"
            onClick={handleLoginClick}>
            Bejelentkezés
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            className="text-black bg-white font-bold px-5 py-2 rounded-xl transition-all duration-200 
                       hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5 
                       active:scale-95 active:translate-y-0 cursor-pointer shadow-sm"
            onClick={handleRegisterClick}>
            Regisztráció
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
