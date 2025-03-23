import React from "react";
import { motion } from "framer-motion";
import { MdEco } from "react-icons/md";
import { GiReceiveMoney, GiTrafficLightsReadyToGo } from "react-icons/gi";
import { RiUserCommunityFill } from "react-icons/ri";
import { FaEarthAsia } from "react-icons/fa6";

const Benefits = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-green-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 flex items-center space-x-3">
        <FaEarthAsia className="text-green-500 text-5xl animate-spin-slow" />
        <span>Why Carpooling?</span>
      </h2>

      {/* Grid Layout for Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lower Costs Card */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-blue-500 hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <GiReceiveMoney className="text-orange-400 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Lower Costs, More Saving
          </h3>
          <p className="text-gray-600 mt-2">
            Say goodbye to skyrocketing fuel prices and expensive solo commutes.
            Share a ride, share the cost!
          </p>
        </motion.div>

        {/* Less Traffic Card */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-green-500 hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <GiTrafficLightsReadyToGo className="text-green-500 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Less Traffic, More Convenience
          </h3>
          <p className="text-gray-600 mt-2">
            Fewer cars on the road mean less congestion, fewer traffic jams, and
            faster travel times for everyone.
          </p>
        </motion.div>

        {/* Stronger Connections Card */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-purple-500 hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <RiUserCommunityFill className="text-purple-500 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Stronger Connections
          </h3>
          <p className="text-gray-600 mt-2">
            Turn your daily commute into an opportunity to meet like-minded
            people and build a sense of community.
          </p>
        </motion.div>

        {/* Eco-Friendly Card */}
        <motion.div
          className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-teal-500 hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <MdEco className="text-teal-500 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Drive Green, Breathe Clean
          </h3>
          <p className="text-gray-600 mt-2">
            Fewer cars = less pollution and a smaller carbon footprint.
            Carpooling is an easy way to help the planet without changing your
            routine.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
