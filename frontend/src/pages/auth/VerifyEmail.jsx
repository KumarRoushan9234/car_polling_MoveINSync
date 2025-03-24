import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const VerifyEmail = () => {
  const { email, verifyEmail, isVerifyingEmail } = useAuthStore();
  const [token, setToken] = useState("");
  const [timer, setTimer] = useState(900);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsOtpExpired(true);
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token && email) {
      verifyEmail(token, email).then((response) => {
        if (response.success) {
          toast.success("Email verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error("Invalid token. Please try again.");
        }
      });
    } else {
      toast.error("Please enter both a valid email and OTP.");
    }
  };

  const handleOtpChange = (e) => {
    setToken(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResendOtp = () => {
    setIsResendingOtp(true);
    toast.success("OTP has been resent! Please check your email.");
    setIsResendingOtp(false);

    setTimer(900);
    setIsOtpExpired(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Loader isLoading={isVerifyingEmail} />
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl text-black font-semibold text-center mb-4">
          Verify Your Email
        </h2>

        {isVerifyingEmail ? (
          <p className="text-center text-black">Verifying your email...</p>
        ) : (
          <p className="text-center text-gray-600">
            Please enter the verification token sent to your email.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Token (OTP) Input */}
          <label className="block text-gray-700 font-medium mt-4 mb-2">
            Token
          </label>
          <input
            type="text"
            value={token}
            onChange={handleOtpChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter your verification token"
            maxLength={6}
            required
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md"
            disabled={isVerifyingEmail || isResendingOtp}
          >
            {isVerifyingEmail ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          <p>OTP expires in: {formatTime(timer)}</p>
          {isOtpExpired && (
            <button
              onClick={handleResendOtp}
              className="mt-2 bg-yellow-500 text-white py-1 px-4 rounded-md"
              disabled={isResendingOtp}
            >
              {isResendingOtp ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
