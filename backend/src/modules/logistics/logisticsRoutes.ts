import { Router } from "express";
import { LogisticsController } from "./logisticsController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/rbacMiddleware.js";
import { Role } from "@prisma/client";

const router = Router();

// Routes for Logistics Providers
router.get("/available", authenticate, requireRole([Role.LOGISTICS]), LogisticsController.getAvailableRoutes);
router.get("/me", authenticate, requireRole([Role.LOGISTICS]), LogisticsController.getMyRoutes);
router.post("/:id/accept", authenticate, requireRole([Role.LOGISTICS]), LogisticsController.acceptRoute);
router.put("/:id/status", authenticate, requireRole([Role.LOGISTICS]), LogisticsController.updateRouteStatus);

// High-frequency live tracking ping
router.put("/:id/location", authenticate, requireRole([Role.LOGISTICS]), LogisticsController.updateLocation);

export default router;
