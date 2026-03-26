import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { WalletController } from "./walletController.js";

const walletRoutes = Router();

// Ensure both farmers and buyers can access wallet features
walletRoutes.get("/", authenticate, WalletController.getWallet);
walletRoutes.post("/simulate", authenticate, WalletController.simulateTransaction);

export default walletRoutes;
