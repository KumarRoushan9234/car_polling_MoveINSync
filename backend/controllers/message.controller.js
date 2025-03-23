import mongoose from "mongoose";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user._id;

    if (!receiver || !content) {
      return res.status(400).json({ message: "Receiver and content are required" });
    }

    const message = await Message.create({ sender, receiver, content });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ✅ Get all messages between two users (chat history)
 */


export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user?._id; // Get the logged-in user's ID

    console.log("SenderId Type:", typeof senderId, "ReceiverId Type:", typeof receiverId); // Debugging

    // Ensure senderId and receiverId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
    }

    // Convert to strings explicitly
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    // Fetch messages
    const messages = await Message.find({
      $or: [
        { sender: senderObjectId, receiver: receiverObjectId },
        { sender: receiverObjectId, receiver: senderObjectId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




/**
 * ✅ Get all conversations (list of users chatted with)
 */

export const getAllConversations = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure valid ObjectId

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $group: {
          _id: {
            sender: "$sender",
            receiver: "$receiver",
          },
          lastMessage: { $last: "$content" },
          timestamp: { $last: "$createdAt" },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    // Extract unique user IDs
    const userConversations = {};
    conversations.forEach((conv) => {
      const otherUserId =
        conv._id.sender.toString() === userId.toString()
          ? conv._id.receiver.toString()
          : conv._id.sender.toString();

      userConversations[otherUserId] = {
        lastMessage: conv.lastMessage,
        timestamp: conv.timestamp,
      };
    });

    // Fetch user details
    const users = await User.find({ _id: { $in: Object.keys(userConversations) } })
      .select("name email picture")
      .lean();

    // Attach last message and timestamp to users
    const formattedConversations = users.map((user) => ({
      ...user,
      lastMessage: userConversations[user._id.toString()].lastMessage,
      timestamp: userConversations[user._id.toString()].timestamp,
    }));

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



/**
 * ✅ Delete a message (optional)
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
