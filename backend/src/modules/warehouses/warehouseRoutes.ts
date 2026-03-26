import { Router } from "express";
import { WarehouseController } from "./warehouseController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/rbacMiddleware.js";
import { Role } from "@prisma/client";

const router = Router();

// Routes for Logistics / Warehouse Managers
router.post("/", authenticate, requireRole([Role.LOGISTICS]), WarehouseController.createWarehouse);
router.get("/me", authenticate, requireRole([Role.LOGISTICS]), WarehouseController.getMyWarehouses);
router.put("/:id", authenticate, requireRole([Role.LOGISTICS]), WarehouseController.updateWarehouse);

// Inventory tracking sub-routes
router.post("/:warehouseId/inventory", authenticate, requireRole([Role.LOGISTICS]), WarehouseController.addInventory);
router.put("/:warehouseId/inventory/:inventoryId/dispatch", authenticate, requireRole([Role.LOGISTICS]), WarehouseController.dispatchInventory);

export default router;
