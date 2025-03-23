import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { FiNavigation } from "react-icons/fi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [leavingFrom, setLeavingFrom] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [leavingSuggestions, setLeavingSuggestions] = useState([]);
  const [goingSuggestions, setGoingSuggestions] = useState([]);

  const calendarRef = useRef(null);
  const passengerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        passengerRef.current &&
        !passengerRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from Nominatim API
  const fetchLocationSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();

      setSuggestions(
        data.slice(0, 5).map((place) => ({
          name: place.display_name,
          lat: place.lat,
          lon: place.lon,
        }))
      );
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  return (
    <section className="flex justify-center py-5">
      <div className="bg-white shadow-xl rounded-xl flex flex-wrap md:flex-nowrap items-center p-4 space-x-6 w-[95%] max-w-[1400px] relative transition-all duration-600">
        {/* Leaving From */}
        <div className="flex-1 relative">
          <div className="flex items-center space-x-3 hover:bg-gray-300 rounded-xl p-2 transition-all duration-600">
            <FaMapMarkerAlt className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Leaving from"
              value={leavingFrom}
              onChange={(e) => {
                setLeavingFrom(e.target.value);
                fetchLocationSuggestions(e.target.value, setLeavingSuggestions);
              }}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>

          {/* Suggestions Dropdown */}
          {leavingSuggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50">
              {leavingSuggestions.map((place, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setLeavingFrom(place.name);
                    setLeavingSuggestions([]);
                  }}
                >
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden md:block border-l border-gray-300 h-10"></div>

        {/* Going To */}
        <div className="flex-1 relative">
          <div className="flex items-center space-x-3 hover:bg-gray-300 rounded-xl p-2 transition-all duration-600">
            <FaMapMarkerAlt className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Destination"
              value={goingTo}
              onChange={(e) => {
                setGoingTo(e.target.value);
                fetchLocationSuggestions(e.target.value, setGoingSuggestions);
              }}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>

          {/* Suggestions Dropdown */}
          {goingSuggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50">
              {goingSuggestions.map((place, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setGoingTo(place.name);
                    setGoingSuggestions([]);
                  }}
                >
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden md:block border-l border-gray-300 h-10"></div>

        {/* Calendar */}
        <div
          className="flex items-center space-x-2 relative cursor-pointer hover:bg-gray-300 rounded-xl p-2 transition-all duration-600"
          onClick={() =>
            setActiveDropdown(activeDropdown === "calendar" ? null : "calendar")
          }
        >
          <FaCalendarAlt className="text-gray-500 text-lg" />
          <span className="text-gray-700">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>

          <AnimatePresence>
            {activeDropdown === "calendar" && (
              <motion.div
                ref={calendarRef}
                className="absolute top-[60px] right-0 bg-white p-4 rounded-lg shadow-xl z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  minDate={new Date()} // Prevent past dates
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:block border-l border-gray-300 h-10"></div>

        {/* Search Button */}
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 flex items-center space-x-2 transition-all duration-300">
          <FiNavigation className="text-white text-lg" />
          <span>Search</span>
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
