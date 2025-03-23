import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion for animations

const Preferences = ({ updateFormData, formData }) => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    smokingAllowed: formData.preferences?.smokingAllowed || false,
    music: formData.preferences?.music || false,
    petsAllowed: formData.preferences?.petsAllowed || false,
    femaleOnly: formData.preferences?.femaleOnly || false,
    chattyDriver: formData.preferences?.chattyDriver || false,
  });

  useEffect(() => {
    console.log("Preferences:", preferences);
  }, [preferences]);

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    updateFormData({ preferences });
    navigate("/rides/create/additional-notes");
  };

  return (
    <motion.div
      className="flex flex-col items-center p-5 text-gray-950 bg-green-200 h-screen"
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
        Set your ride preferences
      </motion.h1>

      <motion.div
        className="form-control text-gray-950 mt-4 w-full max-w-md space-y-10 space-x-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {Object.keys(preferences).map((key) => (
          <motion.label
            key={key}
            className="label cursor-pointer justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <span className="label-text capitalize text-gray-950">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={preferences[key]}
              onChange={() => togglePreference(key)}
            />
          </motion.label>
        ))}
      </motion.div>

      <motion.button
        className="btn bg-green-600  p-3 rounded-md mt-6 w-full max-w-md text-gray-950 hover:bg-green-700 transition-all"
        onClick={handleNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default Preferences;
