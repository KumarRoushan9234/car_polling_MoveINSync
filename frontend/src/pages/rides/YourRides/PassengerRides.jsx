import React, { useState, useEffect } from "react";
import axios from "axios";
import RideCard from "./RideCard";
import { FaSearch } from "react-icons/fa";

const PassengerRides = () => {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getPassengerRides = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/rides/passenger_rides",
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const passengerRides = response?.data?.data || []; // Updated to fetch the correct response structure
      setRides(passengerRides);
      setFilteredRides(passengerRides);
    } catch (error) {
      console.error("Error fetching passenger rides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPassengerRides();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = rides.filter((ride) =>
      ride.vehicle.model
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredRides(filtered);
  };

  return (
    <div>
      <div className="mb-4 flex items-center bg-white p-2 rounded-lg shadow-md">
        <FaSearch className="text-gray-600 mr-2" />
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg placeholder-gray-700"
          placeholder="Search by ride model..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="w-full h-[70vh] overflow-y-auto pr-2 pb-10">
        {loading ? (
          <p className="text-gray-500">Loading rides...</p>
        ) : filteredRides.length === 0 ? (
          <p className="text-gray-500">No rides available.</p>
        ) : (
          <div className="space-y-6">
            {filteredRides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerRides;
