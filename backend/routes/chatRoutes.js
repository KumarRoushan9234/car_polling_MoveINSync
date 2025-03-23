import express from "express";
import { sendMessage, getMessages, getAllConversations, deleteMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send", protectRoute, sendMessage);
router.get("/", protectRoute, getAllConversations);

router.get("/:receiverId", protectRoute, getMessages);



router.delete("/:messageId", protectRoute, deleteMessage);

export default router;
