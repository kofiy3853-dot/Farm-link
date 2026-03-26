import type { Request, Response } from "express";
import { WalletService } from "./walletService.js";

export class WalletController {
    static async getWallet(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const data = await WalletService.getWalletAndTransactions(userId);
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async simulateTransaction(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const { amount, type, reference } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Amount must be greater than 0" });
            }

            const transaction = await WalletService.simulateDeposit(userId, amount, type, reference);
            res.json({ message: "Transaction successful", transaction });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
