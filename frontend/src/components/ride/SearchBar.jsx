import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import {}
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoLocationOutline } from "react-icons/io5";
import { FaUser, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { FiNavigation } from "react-icons/fi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ onSearch }) => {
  const navigate = useNavigate();

  const [passengerCount, setPassengerCount] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leavingFrom, setLeavingFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [leavingCoords, setLeavingCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const leavingInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const leavingAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(loadGoogleMaps);
        initAutocomplete();
      }
    }, 500);
    return () => clearInterval(loadGoogleMaps);
  }, []);

  const initAutocomplete = () => {
    if (leavingInputRef.current) {
      leavingAutocompleteRef.current =
        new window.google.maps.places.Autocomplete(leavingInputRef.current, {
          types: ["geocode"],
        });

      leavingAutocompleteRef.current.addListener("place_changed", () => {
        const place = leavingAutocompleteRef.current.getPlace();
        if (!place.geometry) return;
        setLeavingFrom(place.formatted_address);
        setLeavingCoords({
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng(),
        });
      });
    }

    if (destinationInputRef.current) {
      destinationAutocompleteRef.current =
        new window.google.maps.places.Autocomplete(
          destinationInputRef.current,
          {
            types: ["geocode"],
          }
        );

      destinationAutocompleteRef.current.addListener("place_changed", () => {
        const place = destinationAutocompleteRef.current.getPlace();
        if (!place.geometry) return;
        setDestination(place.formatted_address);
        setDestinationCoords({
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng(),
        });
      });
    }
  };

  // const handleSearch = () => {
  //   if (!leavingCoords || !destinationCoords) {
  //     alert("Please select valid locations.");
  //     return;
  //   }

  //   const searchParams = {
  //     leavingFrom,
  //     leavingCoords,
  //     destination,
  //     destinationCoords,
  //     date: selectedDate.toISOString(),
  //     numPassengers: passengerCount,
  //   };

  //   console.log("Navigating to /rides with:", searchParams);
  //   navigate(`/rides?${queryParams.toString()}`, { state: searchParams });
  //   // Navigate to "/rides" with state
  // };

  const handleSearch = () => {
    if (!leavingCoords || !destinationCoords) {
      alert("Please select valid locations.");
      return;
    }

    const searchParams = {
      leavingFrom,
      leavingCoords,
      destination,
      destinationCoords,
      date: selectedDate.toISOString(),
      numPassengers: passengerCount,
    };

    console.log("Triggering search with:", searchParams);
    // onSearch(searchParams);
    navigate("/rides", { state: searchParams });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex justify-center py-5">
      <div className="bg-white shadow-md rounded-xl flex flex-wrap md:flex-nowrap items-center p-4 space-x-4 w-[95%] max-w-[1200px] relative">
        {/* Leaving From */}
        <div className="flex-1 flex items-center space-x-3 border rounded-xl p-3 hover:shadow-md transition">
          <FaMapMarkerAlt className="text-blue-500 text-lg" />
          <input
            ref={leavingInputRef}
            type="text"
            placeholder="Leaving from"
            value={leavingFrom}
            onChange={(e) => setLeavingFrom(e.target.value)}
            className="w-full outline-none text-gray-700 bg-transparent"
          />
        </div>

        {/* Going To */}
        <div className="flex-1 flex items-center space-x-3 border rounded-xl p-3 hover:shadow-md transition">
          <FaMapMarkerAlt className="text-red-500 text-lg" />
          <input
            ref={destinationInputRef}
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full outline-none text-gray-700 bg-transparent"
          />
        </div>

        {/* Calendar */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 border rounded-xl p-3 hover:shadow-md transition"
            onClick={() =>
              setActiveDropdown(
                activeDropdown === "calendar" ? null : "calendar"
              )
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
          </button>

          <AnimatePresence>
            {activeDropdown === "calendar" && (
              <motion.div
                ref={dropdownRef}
                className="absolute top-14 left-0 bg-white p-4 rounded-lg shadow-xl z-50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  minDate={new Date()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Passenger Counter */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 border rounded-xl p-3 hover:shadow-md transition"
            onClick={() =>
              setActiveDropdown(
                activeDropdown === "passenger" ? null : "passenger"
              )
            }
          >
            <FaUser className="text-gray-500 text-lg" />
            <span className="text-gray-700">
              {passengerCount} {passengerCount > 1 ? "Passengers" : "Passenger"}
            </span>
          </button>

          <AnimatePresence>
            {activeDropdown === "passenger" && (
              <motion.div
                ref={dropdownRef}
                className="absolute top-14 left-0 bg-white p-4 rounded-lg shadow-xl z-50 w-64"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      setPassengerCount(Math.max(1, passengerCount - 1))
                    }
                  >
                    <CiCircleMinus className="text-black text-2xl" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900">
                    {passengerCount}
                  </span>
                  <button
                    onClick={() =>
                      setPassengerCount(Math.min(4, passengerCount + 1))
                    }
                  >
                    <CiCirclePlus className="text-black text-2xl" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 flex items-center space-x-2 transition"
          onClick={handleSearch}
        >
          <FiNavigation className="text-white text-lg" />
          <span>Search</span>
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
