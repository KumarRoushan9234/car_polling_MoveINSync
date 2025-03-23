import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion for animations

const MaxPassengers = ({ updateFormData, formData }) => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(formData.maxPassengers || 1);

  useEffect(() => {
    console.log("Max Passengers:", passengers);
  }, [passengers]);

  const handleNext = () => {
    updateFormData({ maxPassengers: passengers });
    navigate("/rides/create/preferences");
  };

  return (
    <motion.div
      className="flex flex-col items-center text-gray-950 p-5 bg-green-200 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-semibold text-gray-950 mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Select the maximum number of passengers
      </motion.h1>

      <motion.input
        type="range"
        min="1"
        max="6"
        step="1"
        className="range range-accent w-full max-w-md text-yellow-950 mt-4"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />

      <motion.p
        className="text-lg font-bold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {passengers} Passengers
      </motion.p>

      <motion.div
        className="flex gap-4 justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <button
          className="btn bg-green-600 text-gray-950 p-3 rounded-md hover:bg-green-700 transition-all"
          onClick={handleNext}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MaxPassengers;
