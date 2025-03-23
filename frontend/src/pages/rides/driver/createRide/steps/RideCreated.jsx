import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RideCreated = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-200 via-green-300 to-green-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-white mb-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
      >
        🎉 Ride Created!
      </motion.h1>

      <motion.p
        className="text-lg text-white mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your ride has been successfully created. Let’s get you on your way!
      </motion.p>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Link
          to="/rides"
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg shadow-lg text-center text-xl font-semibold transform transition-all hover:scale-105 hover:from-green-600 hover:to-green-800"
        >
          View Rides
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default RideCreated;
