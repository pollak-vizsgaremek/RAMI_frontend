import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/RAMI_logo.png";
import { Search } from "lucide-react"; // Import Search icon

// Assuming you might want to pass a search handler/value later
const Navbar = ({
  onLoginClick,
  onRegisterClick,
  onSearchChange,
  searchValue,
}) => {
  const handleLoginClick = () => {
    onLoginClick?.();
  };

  const handleRegisterClick = () => {
    onRegisterClick?.();
  };

  return (
    <nav className="bg-[#3A4750] p-2 sticky top-0 z-50 shadow-md">
      {/* Updated to w-full and uses flex justify-between for far sides */}
      <div className="w-full max-w-7xl mx-auto flex items-center px-4 justify-between">
        {/* Logo and Brand Name (Left Side) */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={logo}
            alt="RAMI logo"
            className="h-14 w-auto object-contain transition-transform group-hover:rotate-3"
          />
          <span className="font-brand text-white text-xl md:text-2xl font-extrabold tracking-tight">
            Rate My <span className="text-yellow-400">Instructor</span>
          </span>
        </Link>

        {/* --- Instructor Search Bar (Center) --- */}
        <div className="grow max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Keresés oktató nevére, pl. Kovács János..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#303841] text-white placeholder-gray-400 rounded-full border border-transparent focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-colors duration-200 text-sm"
            />
          </div>
        </div>
        {/* --- End Search Bar --- */}

        {/* Login and Register Buttons (Right Side) */}
        {/* Removed ml-auto to allow justify-between to push it to the right */}
        <div className="flex items-center space-x-6">
          <button
            className="relative text-white font-medium transition-all duration-200 hover:text-gray-300 active:scale-95 group cursor-pointer"
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
