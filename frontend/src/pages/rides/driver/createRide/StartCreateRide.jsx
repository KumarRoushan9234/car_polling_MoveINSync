import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { motion } from "framer-motion";

const StartCreateRide = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="text-sm flex flex-col items-center justify-center min-h-screen bg-green-50 p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
          <FaCar className="text-green-600" size={30} />
          <span>Ready to Share Your Ride?</span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600">
          Carpooling helps reduce traffic, saves fuel, and makes commuting more
          social! Create a ride and pick up passengers along your route.
        </p>
        <p className="mt-2 text-gray-500">
          The process is quick and easy. Just provide your ride details step by
          step.
        </p>

        {/* Button */}
        <motion.button
          className="btn btn-primary mt-6 px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transform transition duration-200 hover:scale-105"
          onClick={() => navigate("/rides/create/pickup-location")}
          whileHover={{ scale: 1.05 }}
        >
          Start Creating Ride
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StartCreateRide;
