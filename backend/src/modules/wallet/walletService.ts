import { prisma } from "../../config/prisma.js";

export class WalletService {
    static async getWalletAndTransactions(userId: string) {
        let wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    escrowBalance: 0,
                },
            });
        }

        const transactions = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: "desc" },
        });

        return { wallet, transactions };
    }

    static async simulateDeposit(userId: string, amount: number, type: string, reference: string) {
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        // Process the simulated deposit
        const updatedWallet = await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { increment: amount },
            },
        });

        // Record the transaction
        const transaction = await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                amount,
                type: type || "DEPOSIT",
                status: "COMPLETED",
                reference: reference || `SIM-${Date.now()}`,
                description: "Simulated Wallet Funding",
            },
        });

        return transaction;
    }
}
