import { Router } from "express";
import { OrderController } from "./orderController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = Router();

// Customer routes
router.post("/", authenticate, OrderController.create);
router.get("/customer", authenticate, OrderController.getCustomerOrders);

// Farmer routes
router.get("/farmer", authenticate, OrderController.getFarmerOrders);
router.patch("/:id/status", authenticate, OrderController.updateStatus);

// Shared routes
router.get("/:id", authenticate, OrderController.getById);
router.delete("/:id", authenticate, OrderController.cancel);
router.get("/", authenticate, OrderController.getAll);

export default router;