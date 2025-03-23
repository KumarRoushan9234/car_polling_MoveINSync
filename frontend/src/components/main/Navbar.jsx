import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegUserCircle, FaSearch, FaCarSide } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const { authUser, isCheckingAuth, logout } = useAuthStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, navigate]);

  return (
    <nav className="fixed z-50 top-0 left-0 w-full flex items-center justify-between p-3 bg-[#353c7b] text-white shadow-md">
      {/* Animated Car Logo */}
      <motion.div
        className="flex items-center space-x-2"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        <motion.div
          animate={{
            x: [0, 10, -10, 5, 0], // Small wobble effect
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <FaCarSide className="w-6 h-6 text-green-300" />
        </motion.div>
        <span className="font-bold text-lg text-green-300 ">Carma</span>
      </motion.div>

      {/* Search Bar */}
      <div className="flex-1 mx-10 max-w-lg relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md bg-[#42455f] border border-gray-700 
          bg-green-200text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-4">
        {isCheckingAuth ? (
          <p className="text-gray-300">Checking...</p>
        ) : authUser ? (
          <>
            <FaRegUserCircle
              className="text-2xl cursor-pointer hover:text-blue-400"
              onClick={() => navigate("/profile")}
            />
            <IoLogOut
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-2xl cursor-pointer text-red-500 hover:text-red-400"
            />
          </>
        ) : (
          <button
            className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-500 rounded-md text-white transition"
            onClick={() => navigate("/login")}
          >
            <FiLogIn className="text-lg" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
