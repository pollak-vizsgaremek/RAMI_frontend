import React from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/RAMI_logo.png";


const Navbar = () => {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <nav className="bg-gray-800 p-1 sticky top-0 z-50">
      <div className="container mx-auto flex items-center">
        <div className="text-white font-bold text-xl">
          <img src={logo} alt="RAMI logo" className="h-20 w-auto"/>
        </div>
        <div className="ml-auto flex space-x-4">
          <button className="text-white hover:text-gray-300 cursor-pointer" onClick={handleLoginClick}>Login</button>
          <button className="text-black bg-white border rounded-xl p-2 cursor-pointer" onClick={handleRegisterClick}>Register</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
