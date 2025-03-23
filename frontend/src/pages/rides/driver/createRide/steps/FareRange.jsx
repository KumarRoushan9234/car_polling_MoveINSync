import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion for animations

const FareRange = ({ updateFormData, formData }) => {
  const navigate = useNavigate();

  const [fare, setFare] = useState({
    min: formData.fareRange?.min || 50,
    max: formData.fareRange?.max || 200,
  });

  useEffect(() => {
    console.log("Fare Range:", fare);
  }, [fare]);

  const handleNext = () => {
    if (fare.min > fare.max) {
      alert("Minimum fare cannot be higher than maximum fare.");
      return;
    }
    updateFormData({ fareRange: fare });
    navigate("/rides/create/max-passengers");
  };

  return (
    <motion.div
      className="flex flex-col items-center p-5 h-screen bg-green-200"
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
        Set a fare range
      </motion.h1>
      <motion.p
        className="text-sm text-gray-950 opacity-80 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Choose a reasonable price for passengers.
      </motion.p>

      <motion.div
        className="w-full max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <label className="text-gray-950">Minimum Fare: ₹{fare.min}</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          className="range range-primary w-full"
          value={fare.min}
          onChange={(e) => setFare({ ...fare, min: Number(e.target.value) })}
        />
      </motion.div>

      <motion.div
        className="w-full max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <label className="text-gray-950">Maximum Fare: ₹{fare.max}</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          className="range range-secondary w-full"
          value={fare.max}
          onChange={(e) => setFare({ ...fare, max: Number(e.target.value) })}
        />
      </motion.div>

      <motion.div
        className="flex gap-4 justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
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

export default FareRange;
