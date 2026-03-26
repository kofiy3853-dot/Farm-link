import { Router } from "express";
import { ProductController } from "./productController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/uploadMiddleware.js";

const router = Router();

// Public routes
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Farmer-only routes
router.post("/", authenticate, upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]), ProductController.create);
router.put("/:id", authenticate, upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]), ProductController.update);
router.delete("/:id", authenticate, ProductController.remove);

export default router;