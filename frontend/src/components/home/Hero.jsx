import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

const images = [
  "/assets/carpool_home.jpg",
  "/assets/carpool_home2.jpg",
  "/assets/carpool_home3.jpg",
  "/assets/carpool_home4.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full h-[80vh] flex items-center justify-center text-white transition-all duration-1000 ease-in-out "
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        // backgroundSize: "contain",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 "></div>

      {/* bg-opacity-50 */}
      <h1 className="absolute bottom-10 text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-800 via-purple-700 via-black to-gray-800 text-transparent bg-clip-text drop-shadow-lg">
        Share a Ride,{" "}
        <TypeAnimation
          sequence={[
            "Save Earth",
            1500,
            "Save Money",
            1500,
            "Save Time",
            1500,
            "Save Environment",
            1500,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
        />
      </h1>
    </section>
  );
};

export default Hero;
