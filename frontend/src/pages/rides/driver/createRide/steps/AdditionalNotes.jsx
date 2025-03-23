import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion for animations

const AdditionalNotes = ({ updateFormData, formData }) => {
  const [notes, setNotes] = useState(formData.additionalNotes || "");
  const navigate = useNavigate();

  const handleNext = () => {
    updateFormData({ additionalNotes: notes });
    navigate("/rides/create/confirm"); // Navigate to confirmation page
  };

  return (
    <motion.div
      className="flex flex-col items-center p-5 bg-green-200 h-screen"
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
        Any additional notes?
      </motion.h1>

      <motion.textarea
        className="textarea textarea-bordered w-full max-w-md mt-4 p-4 rounded-lg border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Optional notes for passengers..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      ></motion.textarea>

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

export default AdditionalNotes;
