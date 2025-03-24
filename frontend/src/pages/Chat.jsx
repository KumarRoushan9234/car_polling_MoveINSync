import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const Chat = () => {
  const { receiverId } = useParams();
  const { authUser, token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(null);

  console.log("receiverId from route params:", receiverId);
  console.log("Authenticated User:", authUser);
  console.log("Token:", token);

  useEffect(() => {
    if (!receiverId) {
      console.error("receiverId is missing. Check route params.");
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const res = await axios.get(
          `https://carpooll-backend.onrender.com/api/messages/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Messages fetched successfully:", res.data);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data || err);
      }
    };

    const fetchReceiverInfo = async () => {
      try {
        console.log("Fetching receiver info...");
        const res = await axios.get(
          `https://carpooll-backend.onrender.com/api/auth/profile/${receiverId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Receiver info fetched:", res.data.data);
        setReceiver(res.data.data);
      } catch (err) {
        console.error(
          "Error fetching receiver info:",
          err.response?.data || err
        );
      }
    };

    fetchMessages();
    fetchReceiverInfo();
  }, [receiverId, token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      console.log("Sending new message:", newMessage);

      const res = await axios.post(
        "https://carpooll-backend.onrender.com/api/messages/send",
        { receiver: receiverId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      console.log("Message sent successfully:", res.data);
      setMessages([...messages, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-[#EAF8E6] text-gray-900 flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h2 className="text-2xl font-bold">Your Messages</h2>
        {receiver ? (
          <div className="flex items-center gap-2 use">
            {receiver.profilePic ? (
              <img
                src={receiver.profilePic}
                alt={receiver.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                {receiver.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-lg font-semibold">{receiver.name}</span>
          </div>
        ) : (
          <span className="text-gray-500"></span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 mt-5">
        {messages.length === 0 ? (
          <motion.div
            className="text-center text-gray-500 mt-10 text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to in-app chat{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, -20, 0, 20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              👋
            </motion.span>
          </motion.div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg._id}
              className={`flex items-center mb-3 ${
                msg.sender === authUser._id ? "justify-end" : "justify-start"
              }`}
              initial={{
                opacity: 0,
                x: msg.sender === authUser._id ? 20 : -20,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === authUser._id
                    ? "bg-green-200 text-gray-900"
                    : "bg-white text-gray-900"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-600 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {msg.sender === authUser._id && (
                <button
                  onClick={() => console.log("Delete function here")}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white p-4 shadow-md flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
