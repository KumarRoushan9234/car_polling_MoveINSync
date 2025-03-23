import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/home/Hero";
import Benefits from "../components/home/Benefits";
import SearchBar from "../components/home/SearchBar";
import FAQAccordion from "../components/home/FAQAccordion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-sm bg-gradient-to-r from-green-50 to-green-100 "
    >
      <Hero />
      <Benefits />
      <SearchBar />
      <FAQAccordion />
    </motion.div>
  );
};

export default Home;
