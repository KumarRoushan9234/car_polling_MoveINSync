import { Link } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaCar, FaMoneyBillWave } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

// Helper functions
const shortenAddress = (address) =>
  address ? address.split(",")[0] : "Unknown";

const generateDriverName = (name, id) =>
  name || (id ? `Driver#${id.slice(-4)}` : "Unknown Driver");

const RideCard = ({ ride }) => {
  return (
    <Link
      to={`/rides/${ride._id}`}
      className="block bg-white p-6 border rounded-lg shadow-md flex items-center justify-between hover:border-orange-500 hover:shadow-lg transition"
    >
      {/* Left - Driver Info */}
      <div className="flex flex-col items-center w-24">
        <FaUser className="text-gray-600 text-4xl mb-2" />
        <span className="text-sm font-semibold text-center">
          {generateDriverName(ride.driver?.name, ride.driver?._id)}
        </span>
      </div>

      {/* Middle - Route */}
      <div className="flex flex-col items-center flex-1 px-4">
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-blue-600 text-lg" />
          <p className="text-gray-700 font-semibold w-full">
            {ride.pickupLocation?.address || "Pickup Location"}
          </p>
        </div>
        <div className="h-10 border-l-2 border-gray-400"></div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-red-600 text-lg" />
          <p className="text-gray-700 font-semibold w-full">
            {ride.dropLocation?.address || "Drop Location"}
          </p>
        </div>
      </div>

      {/* Right - Fare, Time & Seats */}
      <div className="text-right">
        {/* Price - Large */}
        <p className="text-2xl font-bold text-green-600">
          ₹{ride.fareRange?.min} - ₹{ride.fareRange?.max}
        </p>

        {/* Departure Time */}
        <p className="flex items-center justify-end space-x-2 text-gray-600 text-sm mt-1">
          <IoMdTime className="text-lg" />
          <span>
            {ride.departureDate} at {ride.departureTime}
          </span>
        </p>

        {/* Seats Available */}
        <p className="flex items-center justify-end space-x-2 text-gray-600 text-sm mt-1">
          <MdOutlineAirlineSeatReclineNormal className="text-lg" />
          <span>
            {ride.availableSeats} / {ride.maxPassengers} seats available
          </span>
        </p>
      </div>
    </Link>
  );
};

export default RideCard;
