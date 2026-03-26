import { Router } from "express";
import { AdminController } from "./adminController.js";
import { authenticate, isAdmin } from "../../middlewares/authMiddleware.js";

const router = Router();

// Protect all admin routes
router.use(authenticate, isAdmin);

router.get("/stats", AdminController.getDashboardStats);

router.get("/users", AdminController.getAllUsers);
router.put("/users/:id/role", AdminController.updateUserRole);
router.delete("/users/:id", AdminController.deleteUser);

router.get("/products", AdminController.getAllProducts);
router.delete("/products/:id", AdminController.deleteProduct);

router.get("/finance", AdminController.getFinanceStats);
router.get("/logistics", AdminController.getLogisticsStats);
router.get("/compliance", AdminController.getComplianceStats);
router.get("/analytics", AdminController.getAnalytics);
router.get("/communications", AdminController.getCommunications);
router.post("/communications/announce", AdminController.sendGlobalAnnouncement);

export default router;
