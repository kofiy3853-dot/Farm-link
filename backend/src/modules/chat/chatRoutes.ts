import { Router } from "express";
import { ChatController } from "./chatController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = Router();

// All chat routes require authentication
router.get("/", authenticate, ChatController.getChats);
router.get("/:id", authenticate, ChatController.getChatById);
router.post("/", authenticate, ChatController.createChat);
router.get("/:id/messages", authenticate, ChatController.getMessages);
router.post("/:id/messages", authenticate, ChatController.sendMessage);

export default router;
