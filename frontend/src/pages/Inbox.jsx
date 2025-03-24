import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaSort } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const Inbox = () => {
  const { authUser, token } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByRecent, setSortByRecent] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages", {
          withCredentials: true,
        });
        setConversations(res.data.conversations);
      } catch (err) {
        console.error(
          "Error fetching conversations:",
          err.response?.data || err
        );
      }
    };

    fetchConversations();
  }, [token]);

  // Convert timestamp to readable format
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    return (
      dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " " +
      dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Filter & Sort Conversations
  const filteredConversations = conversations
    .filter((conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByRecent
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  return (
    <div className="min-h-screen bg-[#EAF8E6] text-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Inbox</h2>
        <button onClick={() => setSortByRecent(!sortByRecent)}>
          <FaSort className="text-gray-900 text-xl cursor-pointer" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-3 text-gray-600" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-10 p-2 rounded-lg border border-gray-300 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Conversation List */}
      <motion.div layout>
        {filteredConversations.map((conv) => (
          <motion.div
            key={conv._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/chat/${conv._id}`}
              className="flex items-center p-4 mb-3 bg-white rounded-lg shadow-md hover:bg-green-100 transition"
            >
              <img
                src={conv.picture}
                alt={conv.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{conv.name}</h3>
                <p className="text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <p>{formatDate(conv.timestamp)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Inbox;
