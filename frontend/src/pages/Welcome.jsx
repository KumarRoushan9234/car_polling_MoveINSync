import React from "react";
import Navbar2 from "../components/main/Navbar2";
import Footer from "../components/main/Footer";
import { FaLocationDot, FaUsers, FaRoad } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar2 />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-green-50">
        {/* Left Side: Text */}
        <motion.div
          className="max-w-xl space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Share Rides, Save <br /> Money, Save Planet
          </h1>
          <p className="text-gray-700">
            Join the smart commuting revolution. Connect with trusted drivers
            and riders for a sustainable journey.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full"
            >
              Offer a Ride
            </button>

            <button
              onClick={() => navigate("/home")}
              className="border border-green-600 text-green-600 hover:bg-green-100 px-5 py-2 rounded-full"
            >
              Find a Ride
            </button>
          </div>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          className="mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/hero.png"
            alt="Car Ride"
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white text-center">
        <h2 className="text-2xl font-bold mb-10 text-gray-800">
          How RideShare Works
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 max-w-5xl mx-auto px-4 text-black">
          {[
            {
              icon: <FaLocationDot />,
              title: "Set Your Route",
              desc: "Enter your pickup and drop-off locations to find or offer rides along your way.",
            },
            {
              icon: <FaUsers />,
              title: "Match & Connect",
              desc: "Find verified drivers and riders heading your way with similar preferences.",
            },
            {
              icon: <FaRoad />,
              title: "Travel Together",
              desc: "Share the journey, split the costs, and reduce your carbon footprint.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="bg-green-100 p-4 rounded-full flex items-center justify-center mb-4 w-16 h-16 text-gray-900 text-2xl">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto px-4 text-black">
        {/* Left Text Content */}
        <motion.div
          className="flex-1 text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Why Choose RideShare?
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: "fa-shield-check",
                title: "Verified Users",
                desc: "All drivers and riders go through our verification process.",
              },
              {
                icon: "fa-wallet",
                title: "Save Money",
                desc: "Split travel costs and reduce your daily commute expenses.",
              },
              {
                icon: "fa-leaf",
                title: "Eco-Friendly",
                desc: "Reduce carbon emissions by sharing rides with others.",
              },
            ].map((item, index) => (
              <div className="flex items-start gap-4" key={index}>
                <span className="text-green-600 text-xl mt-1">
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/image.png"
            alt="Why Choose RideShare"
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-[#059669] py-16 text-center text-white px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          Ready to Start Sharing Rides?
        </h2>
        <p className="mb-8 text-gray-200">
          Join thousands of users who are already saving money and reducing
          their carbon footprint.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/register"
            className="bg-white text-[#059669] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Create Account
          </a>
          <a
            href="/help"
            className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#059669] transition"
          >
            Learn More
          </a>
        </div>
      </motion.section>

      <Footer />
    </>
  );
};

export default Welcome;
