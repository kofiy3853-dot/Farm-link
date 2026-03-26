import { prisma } from "../../config/prisma.js";
import { NotificationService } from "../notifications/notifyService.js";

export class DisputeService {
    static async raiseDispute(
        orderId: string,
        raisedById: string,
        reason: string,
        evidenceUrl?: string
    ) {
        const existingDispute = await prisma.dispute.findUnique({
            where: { orderId },
        });

        if (existingDispute) {
            throw new Error("A dispute already exists for this order");
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { product: true }
        });

        if (!order) throw new Error("Order not found");

        // Start Transaction
        const [dispute, updatedOrder] = await prisma.$transaction([
            prisma.dispute.create({
                data: {
                    orderId,
                    raisedById,
                    reason,
                    ...(evidenceUrl && { evidenceUrl })
                }
            }),
            prisma.order.update({
                where: { id: orderId },
                data: { status: "disputed" }
            }),
            prisma.auditLog.create({
                data: {
                    action: "DISPUTE_RAISED",
                    entityId: orderId,
                    entityType: "ORDER",
                    performedBy: raisedById,
                    details: { reason, evidenceUrl }
                }
            })
        ]);

        // Notify the other party
        const targetUserId =
            order.customerId === raisedById ? order.product.farmerId : order.customerId;

        await NotificationService.createNotification(
            targetUserId,
            "DISPUTE_OPENED",
            `A dispute has been raised regarding Order #${order.id.slice(0, 8)}.`
        );

        return dispute;
    }

    static async getDisputesByUser(userId: string) {
        return prisma.dispute.findMany({
            where: {
                OR: [
                    { raisedById: userId },
                    { order: { customerId: userId } },
                    { order: { product: { farmerId: userId } } }
                ]
            },
            include: {
                order: {
                    include: { product: true }
                },
                raisedBy: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    static async getDisputeById(disputeId: string) {
        return prisma.dispute.findUnique({
            where: { id: disputeId },
            include: {
                order: { include: { product: true, customer: true } },
                raisedBy: true
            }
        });
    }

    static async resolveDispute(
        disputeId: string,
        resolution: "RESOLVED_REFUND" | "RESOLVED_RELEASE",
        adminNotes?: string,
        adminId?: string
    ) {
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: { include: { product: true } } }
        });

        if (!dispute) throw new Error("Dispute not found");
        if (dispute.status !== "OPEN" && dispute.status !== "UNDER_REVIEW") {
            throw new Error("Dispute is already resolved");
        }

        const order = dispute.order;

        await prisma.$transaction(async (tx) => {
            // 1. Update Dispute Status
            await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: resolution,
                    ...(adminNotes && { adminNotes })
                }
            });

            // 2. Resolve Escrow Funds logically based on Resolution
            if (order.paymentStatus !== 'RELEASED' && order.paymentStatus !== 'REFUNDED') {
                const farmerWallet = await tx.wallet.findUnique({ where: { userId: order.product.farmerId } });
                const buyerWallet = await tx.wallet.findUnique({ where: { userId: order.customerId } });

                if (resolution === "RESOLVED_REFUND") {
                    // Refund to Buyer
                    if (buyerWallet && farmerWallet) {
                        await tx.wallet.update({
                            where: { id: buyerWallet.id },
                            data: { balance: { increment: order.totalprice } }
                        });
                        // Deduct from Farmer Escrow 
                        await tx.wallet.update({
                            where: { id: farmerWallet.id },
                            data: { escrowBalance: { decrement: order.totalprice } }
                        });
                        await tx.transaction.create({
                            data: {
                                walletId: buyerWallet.id,
                                amount: order.totalprice,
                                type: "REFUND",
                                status: "COMPLETED",
                                reference: order.id,
                                description: `Dispute refunded for Order #${order.id.slice(0, 8)}`
                            }
                        });
                    }
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: 'cancelled', paymentStatus: 'REFUNDED' }
                    });
                } else if (resolution === "RESOLVED_RELEASE") {
                    // Release to Farmer
                    if (farmerWallet) {
                        await tx.wallet.update({
                            where: { id: farmerWallet.id },
                            data: {
                                balance: { increment: order.totalprice },
                                escrowBalance: { decrement: order.totalprice }
                            }
                        });
                        await tx.transaction.create({
                            data: {
                                walletId: farmerWallet.id,
                                amount: order.totalprice,
                                type: "ESCROW_RELEASE",
                                status: "COMPLETED",
                                reference: order.id,
                                description: `Dispute released for Order #${order.id.slice(0, 8)}`
                            }
                        });
                    }
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: 'completed', paymentStatus: 'RELEASED' }
                    });
                }
            }

            // 3. Log Audit
            await tx.auditLog.create({
                data: {
                    action: resolution,
                    entityId: disputeId,
                    entityType: "DISPUTE",
                    performedBy: adminId || "SYSTEM",
                    details: { adminNotes }
                }
            });
        });

        // Notify parties
        await NotificationService.createNotification(
            order.customerId,
            "DISPUTE_RESOLVED",
            `Dispute for Order #${order.id.slice(0, 8)} has been closed.`
        );
        await NotificationService.createNotification(
            order.product.farmerId,
            "DISPUTE_RESOLVED",
            `Dispute for Order #${order.id.slice(0, 8)} has been closed.`
        );

        return { message: "Dispute resolved successfully" };
    }
}
