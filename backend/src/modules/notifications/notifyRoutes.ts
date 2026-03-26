import { Router } from "express";
import { NotificationController } from "./notifyController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = Router();

// All notification routes require authentication
router.get("/", authenticate, NotificationController.getNotifications);
router.put("/:id/read", authenticate, NotificationController.markAsRead);
router.delete("/:id", authenticate, NotificationController.deleteNotification);

export default router;
