import React from "react";
import { FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-2">
        <FaCarSide className="w-6 h-6 text-black" />
        <span className="font-bold text-lg text-gray-800">Carma</span>
      </div>

      <div className="flex items-center space-x-6">
        <a href="#" className="text-sm text-gray-700 hover:text-black">
          How it Works
        </a>
        <a href="#" className="text-sm text-gray-700 hover:text-black">
          For Drivers
        </a>
        <a href="#" className="text-sm text-gray-700 hover:text-black">
          For Riders
        </a>
        <a href="#" className="text-sm text-gray-700 hover:text-black">
          Documentation
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-sm text-gray-700 hover:text-black">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1 text-sm"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
