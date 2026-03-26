import { Router } from "express";
import { VehicleController } from "./vehicleController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/rbacMiddleware.js";
import { Role } from "@prisma/client";

const router = Router();

// Routes for Logistics Providers to manage their fleet
router.post("/", authenticate, requireRole([Role.LOGISTICS]), VehicleController.createVehicle);
router.get("/me", authenticate, requireRole([Role.LOGISTICS]), VehicleController.getMyVehicles);
router.put("/:id", authenticate, requireRole([Role.LOGISTICS]), VehicleController.updateVehicle);
router.delete("/:id", authenticate, requireRole([Role.LOGISTICS]), VehicleController.deleteVehicle);

export default router;
