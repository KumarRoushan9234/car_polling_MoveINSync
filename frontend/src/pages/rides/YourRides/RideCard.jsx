import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaMapMarkerAlt, FaCar, FaMoneyBillWave } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { useAuthStore } from "../../../store/authStore";

const RideCard = ({ ride }) => {
  const { authUser } = useAuthStore((state) => state);
  if (!ride?._id) {
    console.error("Ride ID (_id) is missing for this ride:", ride);
    return null;
  }

  const isDriver = authUser?._id === ride.driver?._id;
  const isPassenger = ride.passengers?.some(
    (passenger) => passenger._id === authUser?._id
  );

  const redirectTo = isDriver
    ? `/driver-page/${ride._id}` // Redirect driver to driver page
    : // : isPassenger
      // ? `/passenger-page/${ride._id}` // Redirect passenger to passenger page
      `/rides/${ride._id}`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={redirectTo}
        className="block bg-green-50 border border-green-200 p-6 rounded-xl shadow-md 
                   flex items-center justify-between transition-all duration-300 
                   hover:shadow-lg hover:border-green-400"
      >
        <div className="flex flex-col items-center w-24">
          <FaUser className="text-green-600 text-4xl mb-2" />
          <span className="text-sm font-semibold text-center text-gray-900">
            {ride.driver?.name || `Driver#${ride.driver?._id.slice(-4)}`}
          </span>
        </div>

        <div className="flex flex-col items-center flex-1 px-4">
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
            <p className="text-gray-900 font-semibold truncate w-40">
              {ride.pickupLocation?.address.split(",")[0] || "Unknown"}
            </p>
          </div>
          <div className="h-10 border-l-2 border-gray-400"></div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-red-600 text-lg" />
            <p className="text-gray-900 font-semibold truncate w-40">
              {ride.dropLocation?.address.split(",")[0] || "Unknown"}
            </p>
          </div>
        </div>

        <div className="text-gray-900 flex flex-col items-center space-y-1">
          <div className="flex items-center">
            <FaCar className="mr-2 text-green-600" />
            <span className="text-sm">{ride.vehicle.model}</span>
          </div>
          <div className="flex items-center">
            <IoMdTime className="mr-2 text-green-600" />
            <span className="text-sm">{ride.departureTime}</span>
          </div>
          <div className="flex items-center">
            <CiCalendarDate className="mr-2 text-green-600" />
            <span className="text-sm">{ride.departureDate}</span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-600" />
            <span className="text-sm">
              ₹{ride.fareRange?.min} - ₹{ride.fareRange?.max}
            </span>
          </div>
          <div className="flex items-center">
            <MdOutlineAirlineSeatReclineNormal className="mr-2 text-green-600" />
            <span className="text-sm">{ride.maxPassengers}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RideCard;
