import { Router } from "express";
import { UserController } from "./userController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = Router();

// All user routes require authentication
router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.get("/farmers", UserController.getFarmers);
router.get("/analytics/farmer", authenticate, UserController.getFarmerAnalytics);
router.get("/analytics/buyer", authenticate, UserController.getBuyerAnalytics);
router.put("/profile/logistics", authenticate, UserController.updateProfile);
router.get("/:id", UserController.getUserById);

export default router;
