import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate!
import logo from "../assets/images/RAMI_logo.png";
import { Search, User, Users, Star, LogOut } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const Navbar = ({
  onLoginClick,
  onRegisterClick,
  onSearchChange,
  searchValue,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Felhasználó");
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Initialize the navigate function!

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const savedName =
        localStorage.getItem("userName") ||
        localStorage.getItem("userEmail") ||
        "Felhasználó";
      setUserName(savedName);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Biztosan ki szeretnél jelentkezni?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setIsMenuOpen(false);
    toast.info("Sikeresen kijelentkeztél!");

    window.dispatchEvent(new Event("authChange"));

    // Redirect the user to the home page!
    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#3A4750] p-2 sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-7xl mx-auto flex items-center px-4 justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={logo}
              alt="RAMI logo"
              className="h-14 w-auto object-contain transition-transform group-hover:rotate-3"
            />
            <span className="font-brand text-white text-xl md:text-2xl font-extrabold tracking-tight">
              Rate My <span className="text-[#F6C90E]">Instructor</span>
            </span>
          </Link>

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
                className="w-full pl-10 pr-4 py-2 bg-[#303841] text-white placeholder-gray-400 rounded-full border border-transparent focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-colors duration-200 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <button
                  className="relative text-white font-medium transition-all duration-200 hover:text-gray-300 active:scale-95 group cursor-pointer"
                  onClick={onLoginClick}>
                  Bejelentkezés
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  className="text-black bg-white font-bold px-5 py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 cursor-pointer shadow-sm"
                  onClick={onRegisterClick}>
                  Regisztráció
                </button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 text-white hover:text-[#F6C90E] transition-colors p-1 pr-2 rounded-full hover:bg-[#303841] focus:outline-none cursor-pointer">
                  <span className="font-medium text-sm hidden sm:block pl-2">
                    {userName}
                  </span>
                  <div className="bg-[#303841] p-2 rounded-full border border-gray-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 border border-gray-100">
                    {/* CHANGED TO A LINK to navigate to the Profile Page! */}
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer">
                      <User size={18} className="mr-3 text-gray-400" />
                      Profil
                    </Link>

                    <button className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer">
                      <Users size={18} className="mr-3 text-gray-400" />
                      Oktatóim
                    </button>

                    <button className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer">
                      <Star size={18} className="mr-3 text-gray-400" />
                      Értékeléseim
                    </button>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                      <LogOut size={18} className="mr-3" />
                      Kijelentkezés
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Navbar;
