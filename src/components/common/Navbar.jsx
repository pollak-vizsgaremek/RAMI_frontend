import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/RAMI_logo.png";
import {
  Search,
  User,
  Users,
  Star,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  getToken,
  getStoredUser,
} from "../../services/storage/storageService.js";

const Navbar = ({
  onLoginClick,
  onRegisterClick,
  onSearchChange,
  searchValue,
  searchResults = [],
  isSearching = false,
  searchError = null,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [userName, setUserName] = useState("Felhasználó");
  const [userRole, setUserRole] = useState(null);

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const checkAuth = () => {
    // Check using storageService which checks both localStorage and sessionStorage
    const token = getToken();
    const user = getStoredUser();
    setIsLoggedIn(!!token);
    setUserRole(user?.role);
    if (token && user) {
      setUserName(user.name || user.email || "Felhasználó");
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Biztosan ki szeretnél jelentkezni?");
    if (!confirmLogout) return;

    // Clear both sessionStorage and localStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userRole");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsMenuOpen(false);
    toast.info("Sikeresen kijelentkeztél!");

    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const handleInstructorClick = (instructorId) => {
    setShowSearchDropdown(false);
    if (onSearchChange) onSearchChange("");
    navigate(`/instructor/${instructorId}`);
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

          <div className="grow max-w-xl mx-8 hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Keresés oktató nevére, pl. Kovács János..."
                value={searchValue}
                onChange={(e) => {
                  onSearchChange?.(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 bg-[#303841] text-white placeholder-gray-400 rounded-full border border-transparent focus:border-[#F6C90E] focus:ring-1 focus:ring-[#F6C90E] transition-colors duration-200 text-sm outline-none"
              />

              {showSearchDropdown && searchValue?.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500 font-medium">
                      Keresés folyamatban...
                    </div>
                  ) : searchError ? (
                    <div className="p-4 text-center text-sm text-red-500 font-bold bg-red-50">
                      ⚠️ {searchError}
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((instructor) => {
                      const schoolName =
                        instructor.schools?.[0]?.name ||
                        instructor.schools?.[0] ||
                        "Ismeretlen Autósiskola";
                      return (
                        <div
                          key={instructor._id}
                          onClick={() => handleInstructorClick(instructor._id)}
                          className="p-3 hover:bg-[#F6C90E]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                          <div className="font-bold text-gray-900">
                            {instructor.name}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin size={12} className="mr-1 text-gray-400" />
                            {schoolName}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 font-medium">
                      Nem találtunk ilyen oktatót.
                    </div>
                  )}
                </div>
              )}
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
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl overflow-hidden py-2 border border-gray-100">
                    <Link
                      to="/user-profile"
                      className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}>
                      <User size={18} className="mr-3 text-gray-400" /> Profil
                    </Link>
                    {userRole === "instructor" ? (
                      <Link
                        to="/my-students"
                        className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}>
                        <Users size={18} className="mr-3 text-gray-400" />{" "}
                        Tanulóim
                      </Link>
                    ) : (
                      <Link to="/my-instructors" className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}>
                        <Users size={18} className="mr-3 text-gray-400" />{" "}
                        Oktatóim
                      </Link>
                    )}
                    <Link
                      to="/my-reviews"
                      className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F6C90E]/10 hover:text-[#D4AC0D] transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}>
                      <Star size={18} className="mr-3 text-gray-400" />{" "}
                      Értékeléseim
                    </Link>
                    {userRole === "creator" && (
                      <>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                          onClick={() => setIsMenuOpen(false)}>
                          <Settings size={18} className="mr-3" /> Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                      <LogOut size={18} className="mr-3" /> Kijelentkezés
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
        closeOnClick
      />
    </>
  );
};

export default Navbar;
