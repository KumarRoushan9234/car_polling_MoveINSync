import React, { useState } from "react";
import PassengerRides from "./PassengerRides";
import DriverRides from "./DriverRides";

const YourRides = () => {
  const [isDriver, setIsDriver] = useState(false);

  return (
    <div className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 text-gray-950 h-screen">
      <h2 className="text-2xl text-gray-700 mt-4 font-bold mb-4">Your Rides</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsDriver(true)}
          className={`px-4 py-2 rounded-lg ${
            isDriver ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Driver
        </button>
        <button
          onClick={() => setIsDriver(false)}
          className={`px-4 py-2 rounded-lg ${
            !isDriver ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Passenger
        </button>
      </div>

      {/* Render the respective component based on the user role */}
      {isDriver ? <DriverRides /> : <PassengerRides />}
    </div>
  );
};

export default YourRides;
