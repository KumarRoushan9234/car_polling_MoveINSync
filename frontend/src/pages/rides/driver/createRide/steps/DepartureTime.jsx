import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DepartureTime = ({ updateFormData, formData }) => {
  const navigate = useNavigate();

  // Initialize state from formData if available
  const [date, setDate] = useState(formData.departureDate || "");
  const [time, setTime] = useState(formData.departureTime || "");

  // Get current date and time to block past values
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    console.log("Current Departure Date & Time:", { date, time });
  }, [date, time]);

  const handleNext = () => {
    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    updateFormData({ departureDate: date, departureTime: time });
    navigate("/rides/create/drop-location");
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 text-gray-950 bg-green-200 h-screen shadow-md rounded-xl "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        When are you departing?
      </h1>

      <motion.input
        type="date"
        className="input input-bordered w-full max-w-md bg-gray-50 border-gray-300 focus:outline-none text-gray-700 focus:ring-2 focus:ring-green-600 focus:border-green-600 mb-4 rounded-lg py-2 px-3"
        value={date}
        min={currentDate} // Block past dates
        onChange={(e) => setDate(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      <motion.input
        type="time"
        className="input input-bordered w-full max-w-md bg-gray-50 text-gray-700  border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 mb-6 rounded-lg py-2 px-3"
        value={time}
        min={currentTime} // Block past times
        onChange={(e) => setTime(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />

      <motion.button
        className={`btn bg-green-600 text-white w-full max-w-md py-2 rounded-lg mt-4 ${
          !date || !time
            ? "opacity-100 cursor-not-allowed"
            : "hover:bg-green-900"
        }`}
        onClick={handleNext}
        disabled={!date || !time}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default DepartureTime;
