import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { authUser, isCheckingAuth, login, isLoggingIn } = useAuthStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (authUser && !isCheckingAuth) {
      navigate("/home");
    }
  }, [authUser, isCheckingAuth, navigate]);

  localStorage.clear();
  sessionStorage.clear();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data(login) : ", formData);
    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
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

  useEffect(() => {
    const formContainer = document.querySelector(".form-container");
    const leftPanel = formContainer.querySelector(".left-panel");

    const handleMouseMove = (e) => {
      const { clientX: mouseX, clientY: mouseY } = e;

      const xOffset = mouseX / window.innerWidth - 0.5;
      const yOffset = mouseY / window.innerHeight - 0.5;
      leftPanel.style.transform = `perspective(1000px) rotateX(${
        yOffset * 10
      }deg) rotateY(${xOffset * 10}deg)`;
    };

    formContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      formContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
      <Loader isLoading={isLoggingIn} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden form-container">
          {/* Left Panel (Form) */}
          <div
            className="relative w-1/2 p-8 bg-cover bg-center left-panel"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-vector/background-with-night-city-neon-lights_1441-2597.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Welcome back
              </h1>
              <p className="text-center text-sm text-white mb-4">
                Login to your account
              </p>
              {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

              <form onSubmit={handleSubmit}>
                {/* Email Input */}
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

                {/* Password Input */}
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
                    type={showPassword ? "text" : "password"} // Toggle the input type
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="grow text-white bg-transparent"
                  />
                  <span
                    onClick={togglePassword} // Toggle password visibility
                    className="cursor-pointer text-white"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </label>

                <button type="submit" className="btn btn-primary w-full mb-4">
                  Login
                </button>

                <div className="text-center my-4">
                  <span className="text-sm text-white">Or continue with</span>
                </div>

                <div className="grid gap-2 mb-4">
                  <button
                    className="btn btn-outline w-full flex justify-center items-center bg-blue-500 text-white"
                    disabled
                  >
                    <FaGoogle className="h-5 w-5 mr-2" />
                    <span>Login with Google</span>
                  </button>
                </div>

                <div className="text-center text-sm text-white">
                  Don't have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Description */}
          <div className="w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Us Now!</h2>
            <p className="text-lg mb-4">
              Experience seamless login with our platform. If you're a
              first-time user, sign up today to get started.
            </p>
            <p className="text-lg">
              With secure login options and a user-friendly interface, we make
              it easy to access all the services you need.
            </p>

            <div className="mt-6 text-lg font-semibold">
              <Typewriter
                words={[
                  "Welcome to Our Platform!",
                  "Join Us Today!",
                  "Experience Seamless Login!",
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

export default Login;
