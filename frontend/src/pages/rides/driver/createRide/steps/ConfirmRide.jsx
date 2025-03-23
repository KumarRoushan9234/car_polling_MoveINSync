import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importing framer-motion for animations
import Loader from "./../../../../../components/Loader";
import {
  FaSearchengin,
  FaCar,
  FaMoneyBillWave,
  FaUserFriends,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaUserClock } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaCarSide } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { RiSettings3Fill } from "react-icons/ri";

const ConfirmRide = ({ formData, submitRide }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    await submitRide();
    setLoading(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center p-5 bg-green-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.h2
        className="text-3xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <FaSearchengin className="text-green-700" /> Review Your Ride
      </motion.h2>

      <motion.p
        className="mt-2 text-gray-700 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Check your details before posting.
      </motion.p>

      {/* Ride Details */}
      <motion.div
        className="mt-4 text-left text-gray-900 space-y-4 w-full max-w-2xl bg-white p-5 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="flex items-center gap-2">
          <IoLocationSharp className="text-blue-600 text-xl" />
          <strong>Pickup:</strong> {formData.pickupLocation.address}
        </p>

        <p className="flex items-center gap-2">
          <IoLocationSharp className="text-red-600 text-xl" />
          <strong>Drop-off:</strong> {formData.dropLocation.address}
        </p>

        <p className="flex items-center gap-2">
          <FaUserClock className="text-gray-600 text-xl" />
          <strong>Departure Time:</strong> {formData.departureTime}
        </p>

        <p className="flex items-center gap-2">
          <FaCar className="text-green-700 text-xl" />
          <strong>Vehicle:</strong> {formData.vehicle.model} (
          {formData.vehicle.color})
        </p>

        <p className="flex items-center gap-2">
          <FaMoneyBillWave className="text-yellow-500 text-xl" />
          <strong>Fare Range:</strong> ₹{formData.fareRange.min} - ₹
          {formData.fareRange.max}
        </p>

        <p className="flex items-center gap-2">
          <FaUserFriends className="text-purple-600 text-xl" />
          <strong>Passengers:</strong> {formData.maxPassengers}
        </p>

        <p className="flex items-center gap-2">
          <RiSettings3Fill className="text-gray-700 text-xl" />
          <strong>Preferences:</strong>{" "}
          {Object.entries(formData.preferences)
            .filter(([_, value]) => value)
            .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
            .join(", ") || "None"}
        </p>

        <p className="flex items-center gap-2">
          <MdNoteAlt className="text-blue-500 text-xl" />
          <strong>Notes:</strong>{" "}
          {formData.additionalNotes || "No additional notes"}
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex gap-4 justify-center mt-6 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <button
          className="btn bg-white text-gray-700 border-gray-300 hover:bg-gray-100 rounded-md p-3 w-full max-w-xs shadow-md transition-all flex items-center justify-center gap-2"
          onClick={() => navigate(-1)}
        >
          <RiArrowGoBackFill /> Edit
        </button>

        <button
          className="btn bg-green-600 text-white p-3 rounded-md w-full max-w-xs hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loader /> : "Confirm & Post Ride "}
          <FaCarSide />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmRide;
