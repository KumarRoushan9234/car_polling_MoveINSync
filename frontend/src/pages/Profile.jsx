import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { FaPhone, FaUserCheck, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const ProfilePage = () => {
  const { authUser, checkAuth, updateProfile, logout } = useAuthStore(
    (state) => state
  );
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState(authUser ? authUser.name : "");
  const [email, setEmail] = useState(authUser ? authUser.email : "");
  const [resetMessage, setResetMessage] = useState(null);
  const [resetError, setResetError] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const fetchAuthData = async () => {
      await checkAuth();
      setLoading(false);
    };
    fetchAuthData();
  }, [checkAuth]);

  const handleUpdateProfile = async () => {
    if (newName.trim() !== authUser.name) {
      try {
        await updateProfile({ name: newName });
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Error updating profile!");
      }
    }
  };

  const handleForgotPassword = async () => {
    setResetLoading(true);
    setResetMessage(null);
    setResetError(null);

    try {
      const response = await axios.post(
        "https://carpooll-backend.onrender.com/api/auth/forgot-password",
        { email }
      );
      setResetMessage(response.data.message);
    } catch (err) {
      setResetError(err.response?.data?.message || "Something went wrong");
    } finally {
      setResetLoading(false);
    }
  };

  if (loading || !authUser) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <motion.div
      className="profile-container w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-stone-900">
        Your Profile
      </h2>

      <div className="profile-info mb-8 flex items-center space-x-6">
        <div className="profile-details flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            {authUser.name}
          </h3>
          <p className="text-lg text-gray-500">{authUser.email}</p>
          <div className="flex items-center mt-4 text-stone-900">
            <FaPhone className="text-xl text-gray-500 mr-2" />
            {authUser.isPhoneVerified ? (
              <FaUserCheck className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
            <span className="ml-2">
              {authUser.isPhoneVerified
                ? "Phone Verified"
                : "Phone Not Verified"}
            </span>
          </div>
        </div>
      </div>

      <div className="additional-info mb-8 text-stone-900">
        <motion.h4
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Account Information
        </motion.h4>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="font-semibold text-stone-900 w-40">
              Created At:
            </span>
            <span>{new Date(authUser.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-stone-900 w-40">
              Last Updated:
            </span>
            <span>{new Date(authUser.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-stone-900 w-40">
              Email Verified:
            </span>
            <span>{authUser.isemailVerified ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      <div className="update-profile mb-8">
        <h4 className="text-lg font-semibold mb-2 text-stone-900">
          Update Profile
        </h4>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input input-bordered w-full mb-4 px-4 py-2 rounded-md text-lg"
          placeholder="Enter new name"
        />
        <motion.button
          onClick={handleUpdateProfile}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Name
        </motion.button>
      </div>

      <div className="forgot-password mb-8">
        <h4 className="text-lg font-semibold mb-2 text-stone-900">
          Forgot Password
        </h4>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full mb-4 px-4 py-2 rounded-md text-lg"
          placeholder="Enter your email"
        />
        <motion.button
          onClick={handleForgotPassword}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={resetLoading}
        >
          {resetLoading ? "Sending..." : "Send Reset Link"}
        </motion.button>
        {resetMessage && <p className="text-green-600 mt-2">{resetMessage}</p>}
        {resetError && <p className="text-red-600 mt-2">{resetError}</p>}
      </div>

      <div className="reset-password mb-6">
        <h4 className="text-lg font-semibold mb-2 text-stone-900">
          Reset Password
        </h4>
        <Link to="/reset-password" className="text-blue-600 hover:underline">
          Reset your password
        </Link>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
