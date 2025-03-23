import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { FaUserCircle, FaInfoCircle } from "react-icons/fa";
import {
  MdHome,
  MdAddCircleOutline,
  MdOutlineCommute,
  MdGroupAdd,
} from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import {
  BsLayoutSidebarInsetReverse,
  BsLayoutSidebarInset,
} from "react-icons/bs";
import { RiCustomerService2Fill } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current route

  return (
    <div
      className={`fixed top-14 left-0 h-full bg-[#353c7b] p-4 transition-all duration-500 shadow-lg flex flex-col justify-between relative z-40 
      ${isOpen ? "w-48" : "w-16"} `}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-4 bg-[#3D416F] text-white p-2 rounded-full shadow-md"
      >
        {isOpen ? <BsLayoutSidebarInset /> : <BsLayoutSidebarInsetReverse />}
      </button>

      <nav className="space-y-3">
        <SidebarItem
          isOpen={isOpen}
          icon={<MdHome />}
          text="Home"
          link="/home"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<MdAddCircleOutline />}
          text="Create Ride"
          link="/rides/create"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<MdGroupAdd />}
          text="Join Ride"
          link="/rides"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<MdOutlineCommute />}
          text="Your Rides"
          link="/your_rides"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<FiMail />}
          text="Inbox"
          link="/inbox"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<FaUserCircle />}
          text="Profile"
          link="/profile"
          activePath={location.pathname}
        />

        <div className="border-t border-gray-600 my-3"></div>

        <SidebarItem
          isOpen={isOpen}
          icon={<RiCustomerService2Fill />}
          text="Help"
          link="/help"
          activePath={location.pathname}
        />
        <SidebarItem
          isOpen={isOpen}
          icon={<FaInfoCircle />}
          text="About"
          link="/about"
          activePath={location.pathname}
        />

        <SidebarItem
          isOpen={isOpen}
          icon={<IoLogOut />}
          text="Logout"
          link="/logout"
          activePath={location.pathname}
        />
      </nav>
    </div>
  );
};

const SidebarItem = ({ isOpen, icon, text, link, activePath }) => {
  const isActive = activePath === link;

  return (
    <Link
      to={link}
      className={`relative flex items-center text-gray-300 hover:bg-[#2B305C] p-2 rounded-lg transition ${
        isActive ? "bg-green-300 text-gray-900 font-bold" : ""
      }`}
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="ml-3">{text}</span>}
      {!isOpen && (
        <span
          className="absolute left-14 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 transition-opacity duration-300
        group-hover:opacity-100"
        >
          {text}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;
