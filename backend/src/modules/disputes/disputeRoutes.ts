import { Router } from "express";
import { DisputeController } from "./disputeController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/rbacMiddleware.js";
import { Role } from "@prisma/client";

const router = Router();

// Buyer/Farmer Routes
router.post("/", authenticate, DisputeController.raiseDispute);
router.get("/", authenticate, DisputeController.getUserDisputes);
router.get("/:id", authenticate, DisputeController.getDisputeById);

// Admin Routes
router.post("/:id/resolve", authenticate, requireRole([Role.ADMIN]), DisputeController.resolveDispute);

export default router;
