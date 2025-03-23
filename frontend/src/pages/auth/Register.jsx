import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/Loader";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Before Sending:", formData);

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        duration: 3000,
        style: { background: "#f44336", color: "white" },
        position: "top-right",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 3000,
        style: { background: "#f44336", color: "white" },
        position: "top-right",
      });
      return;
    }

    try {
      const response = await signup(formData);
      console.log("Signup API Response:", response);
      if (response.success) {
        toast.success(response.message, {
          duration: 3000,
          style: { background: "#4CAF50", color: "white" },
          position: "top-right",
        });

        // useAuthStore.getState().setEmail(formData.email);
        setTimeout(() => {
          navigate("/verify-email");
        }, 2000);
      } else {
        toast.error(response.message, {
          duration: 3000,
          style: { background: "#f44336", color: "white" },
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Something went wrong!", {
        duration: 3000,
        style: { background: "#f44336", color: "white" },
        position: "top-right",
      });
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/background-with-night-city-neon-lights_1441-2597.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Loader isLoading={isSigningUp} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden form-container">
          {/* Left Panel (Form) */}
          <div
            className="relative w-1/2 p-6 bg-cover bg-center left-panel animate__animated animate__fadeIn"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-vector/background-with-night-city-neon-lights_1441-2597.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Create an Account
              </h1>
              <p className="text-center text-sm text-white mb-4">
                Sign up to join us
              </p>
              {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

              <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <label className="input input-bordered flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70 text-black"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="grow text-white bg-transparent"
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70 text-black"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="grow text-white bg-transparent"
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70 text-black"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="grow text-white bg-transparent"
                  />
                  <span
                    onClick={togglePassword}
                    className="cursor-pointer text-white"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </label>

                <button type="submit" className="btn btn-primary w-full mb-4">
                  Sign Up
                </button>

                <div className="text-center my-4">
                  <span className="text-sm text-white">Or continue with</span>
                </div>

                <div className="grid gap-2 mb-4">
                  <button className="btn btn-outline w-full flex justify-center items-center bg-blue-500 text-white">
                    <FaGoogle className="h-5 w-5 mr-2" />
                    <span>Sign up with Google</span>
                  </button>
                </div>
                <div className="text-center text-sm text-white">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Log In
                  </a>
                </div>
              </form>
            </div>
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <h2 className="text-4xl font-bold mb-6">Join Us Now!</h2>

            <p className="text-lg mb-4">
              Unlock a world of possibilities with our seamless and secure login
              experience. Whether you're a returning user or joining for the
              first time, we’ve got you covered!
            </p>

            <p className="text-lg mb-4">
              Enjoy fast access, enhanced security, and an intuitive interface
              designed for your convenience. Sign up today and be part of a
              growing community.
            </p>
            {/* <ImagePattern
              title={"Welcome back!"}
              subtitle={
                "Sign in to continue your conversations and catch up with your messages."
              }
            /> */}
            {/* <ul className="list-disc list-inside text-lg space-y-2">
              <li>🔒 Secure and Fast Login</li>
              <li>🎉 Personalized User Experience</li>
              <li>🚀 Access to Premium Features</li>
            </ul> */}

            <div className="mt-8 text-xl font-semibold">
              <Typewriter
                words={[
                  "🔒 Secure and Fast Login!",
                  "🎉 Personalized User Experience",
                  "Experience Seamless Login!",
                  "Your Journey Starts Here!",
                ]}
                loop={Infinity}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
