import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMobileAlt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PhoneVerify = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [step, timer]);

  // Function to send OTP
  const sendOtp = () => {
    if (!phone.match(/^\d{10}$/)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setCanResend(false);
    setTimer(15); // Reset timer

    setTimeout(() => {
      setStep("otp"); // Move to OTP step
      setLoading(false);
      toast.success("📲 OTP Sent Successfully!");
    }, 1000);
  };

  // Function to verify OTP
  const verifyOtp = () => {
    if (otp !== "893456" && otp !== "698343") {
      setError("Invalid OTP. Try again.");
      return;
    }

    toast.success("✅ Phone Verified Successfully!");
    navigate("/rides/create");
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-950 bg-gray-100">
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-96"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex justify-center text-green-500 text-4xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaMobileAlt />
        </motion.div>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          {step === "phone" ? "Phone Verification" : "Enter OTP"}
        </h2>

        {/* Phone Input */}
        {step === "phone" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={sendOtp}
              className="w-full mt-4 bg-green-500 text-white p-3 rounded-md flex items-center justify-center hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
              <IoIosSend className="ml-2" />
            </button>
          </motion.div>
        )}

        {/* OTP Input */}
        {step === "otp" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={verifyOtp}
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP with Timer */}
            <button
              onClick={sendOtp}
              className={`w-full mt-2 text-sm transition ${
                canResend
                  ? "text-blue-500 hover:text-blue-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!canResend}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PhoneVerify;
