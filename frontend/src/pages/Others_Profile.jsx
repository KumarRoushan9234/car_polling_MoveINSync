import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for verification

const Others_Profile = () => {
  const { id } = useParams(); // Extracts ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `https://carpooll-backend.onrender.com/api/auth/profile/${id}`
        );
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-green-300 h-screen flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto bg-white text-gray-900 shadow-xl rounded-lg p-8 text-center"
      >
        {/* User Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaUserCircle className="w-32 h-32 text-gray-500 mx-auto mb-4" />
        </motion.div>

        {/* User Details */}
        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600 text-lg">{user.email}</p>

        {/* Verification Status */}
        <div className="flex justify-center gap-6 mt-4 text-lg">
          <div className="flex items-center gap-2">
            {user.isemailVerified ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-600" />
            )}
            <span>Email Verified</span>
          </div>

          <div className="flex items-center gap-2">
            {user.isphoneVerified ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-600" />
            )}
            <span>Phone Verified</span>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 text-gray-700">
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {formatDate(user.createdAt)}
          </p>
          <p>
            <span className="font-semibold">Last Updated:</span>{" "}
            {formatDate(user.updatedAt)}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Others_Profile;
