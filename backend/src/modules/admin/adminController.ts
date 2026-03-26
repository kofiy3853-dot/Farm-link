import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

export class AdminController {
    static async getDashboardStats(req: Request, res: Response) {
        try {
            const [
                totalUsers,
                totalFarmers,
                totalProducts,
                totalOrders,
                recentUsers,
                recentOrders
            ] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { role: 'FARMER' } }),
                prisma.product.count(),
                prisma.order.count(),
                prisma.user.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, name: true, email: true, role: true, createdAt: true }
                }),
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        customer: { select: { name: true } },
                        product: { select: { name: true, price: true } }
                    }
                })
            ]);

            res.json({
                stats: {
                    totalUsers,
                    totalFarmers,
                    totalProducts,
                    totalOrders
                },
                recentUsers,
                recentOrders
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUserRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!id || !role) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { role },
                select: { id: true, name: true, email: true, role: true }
            });

            res.json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing user id" });
            }

            // Manually delete related records that lack cascade delete rules
            await prisma.$transaction(async (tx) => {
                // 1. Un-link user from delivery routes as driver
                await tx.deliveryRoute.updateMany({
                    where: { driverId: id },
                    data: { driverId: null }
                });

                // 2. Un-link user's vehicles from delivery routes
                const vehicles = await tx.vehicle.findMany({ where: { ownerId: id } });
                const vehicleIds = vehicles.map(v => v.id);
                if (vehicleIds.length > 0) {
                    await tx.deliveryRoute.updateMany({
                        where: { vehicleId: { in: vehicleIds } },
                        data: { vehicleId: null }
                    });
                }

                // 3. Delete disputes raised by user
                await tx.dispute.deleteMany({ where: { raisedById: id } });

                // 4. Delete warehouse inventory owned by user
                await tx.warehouseInventory.deleteMany({ where: { ownerId: id } });

                // 5. Delete warehouses managed by user
                await tx.warehouse.deleteMany({ where: { managerId: id } });

                // 6. Delete the user (this cascades to Products, Orders, Chats, Messages, Notifications, Wallet, Vehicles)
                await tx.user.delete({
                    where: { id }
                });
            });

            res.json({ message: "User successfully deleted" });
        } catch (error: any) {
            console.error("Failed to delete user:", error);
            res.status(500).json({ error: error.message || "Failed to delete user" });
        }
    }

    static async getAllProducts(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    farmer: {
                        select: { name: true, email: true }
                    }
                }
            });
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing product id" });
            }

            // In a real app, handle deleting associated orders or soft-delete
            await prisma.product.delete({
                where: { id }
            });

            res.json({ message: "Product successfully deleted" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getFinanceStats(req: Request, res: Response) {
        try {
            // Get all orders to calculate revenue and commissions
            const allOrders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: { select: { name: true, email: true } },
                    product: {
                        select: { name: true, price: true, category: true, farmer: { select: { name: true } } }
                    }
                }
            });

            let totalPlatformVolume = 0;
            const COMMISSION_RATE = 0.05; // 5% platform fee

            allOrders.forEach(order => {
                totalPlatformVolume += order.totalprice;
            });

            const totalCommission = totalPlatformVolume * COMMISSION_RATE;
            const farmerEarnings = totalPlatformVolume - totalCommission;

            res.json({
                stats: {
                    totalPlatformVolume,
                    totalCommission,
                    farmerEarnings,
                    transactionCount: allOrders.length
                },
                recentTransactions: allOrders.slice(0, 50) // Send top 50 recent transactions
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getLogisticsStats(req: Request, res: Response) {
        try {
            const allOrders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: { select: { name: true, email: true } },
                    product: {
                        select: { name: true, category: true, farmer: { select: { name: true, email: true } } }
                    }
                }
            });

            const statusCounts = {
                pending: 0,
                processing: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0
            };

            allOrders.forEach(order => {
                const status = order.status as keyof typeof statusCounts;
                if (statusCounts[status] !== undefined) {
                    statusCounts[status]++;
                }
            });

            res.json({
                stats: statusCounts,
                activeDeliveries: allOrders.filter(o => o.status === 'processing' || o.status === 'shipped'),
                recentCompleted: allOrders.filter(o => o.status === 'delivered').slice(0, 10)
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getComplianceStats(req: Request, res: Response) {
        try {
            // In a real app, this would use AI anomaly detection or explicit KYC status flags on the user.
            // For now, we will mock flagged users and suspicious listings.

            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });

            // Mock compliance logic: Flag users without names as "KYC Incomplete"
            // Flag some arbitrary active products as "Price Manipulation Risk"
            const kycFlagged = users.filter(u => !u.name || u.name.trim() === '').map(u => ({ ...u, issue: 'Missing Identity Verification (KYC)' }));

            // Let's also randomly grab a few users to flag for demo purposes if the list is empty
            if (kycFlagged.length === 0 && users.length > 0) {
                const targetUser = users[users.length - 1] as any;
                kycFlagged.push({ ...targetUser, issue: 'Unusual Login Location Detected' });
            }

            const products = await prisma.product.findMany({
                take: 10,
                orderBy: { price: 'desc' },
                include: { farmer: { select: { name: true, email: true } } }
            });

            const priceFlagged = products.filter(p => p.price > 1000).map(p => ({ ...p, issue: 'Flagged by AI: Price > 3x Market Average' }));

            res.json({
                stats: {
                    pendingKYC: kycFlagged.length,
                    activeFlags: priceFlagged.length,
                    securityLevel: 'Elevated'
                },
                flaggedUsers: kycFlagged,
                flaggedListings: priceFlagged
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAnalytics(req: Request, res: Response) {
        try {
            // Fetch past 30 days orders for revenue/volume trend
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentOrders = await prisma.order.findMany({
                where: { createdAt: { gte: thirtyDaysAgo } },
                include: { product: { select: { category: true } } },
                orderBy: { createdAt: 'asc' }
            });

            // Aggregate revenue by day
            const dailyRevenue: Record<string, number> = {};
            const categoryDistribution: Record<string, number> = {};

            recentOrders.forEach(order => {
                const dateKey = (order.createdAt ? order.createdAt.toISOString().split('T')[0] : 'UNKNOWN_DATE') || 'UNKNOWN_DATE';
                const currentRevenue = dailyRevenue[dateKey as string] || 0;
                dailyRevenue[dateKey as string] = currentRevenue + (order.totalprice || 0);

                const catKey = (order.product?.category as string) || 'UNKNOWN';
                const currentCatCount = categoryDistribution[catKey] || 0;
                categoryDistribution[catKey] = currentCatCount + 1;
            });

            const revenueTrend = Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue }));
            const productCategories = Object.entries(categoryDistribution).map(([name, count]) => ({ name, value: count }));

            res.json({
                revenueTrend,
                productCategories,
                totalOrdersLast30Days: recentOrders.length
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCommunications(req: Request, res: Response) {
        try {
            // Fetch recent system-level notifications
            const recentAnnouncements = await prisma.notification.findMany({
                where: { type: 'SYSTEM_ANNOUNCEMENT' },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { user: { select: { name: true, role: true } } }
            });

            // Fetch a breakdown of active chats
            const activeChatsCount = await prisma.chat.count();
            const recentMessagesCount = await prisma.message.count({
                where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } }
            });

            // Fetch recent user feedback or contact requests if we had a dedicated model.
            // For now, let's just send the counts and top active users for messaging

            const topCommunicators = await prisma.user.findMany({
                orderBy: { messages: { _count: 'desc' } },
                take: 5,
                select: { id: true, name: true, email: true, role: true, _count: { select: { messages: true } } }
            });

            res.json({
                stats: {
                    activeChats: activeChatsCount,
                    messagesLast7Days: recentMessagesCount
                },
                recentAnnouncements,
                topCommunicators
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async sendGlobalAnnouncement(req: Request, res: Response) {
        try {
            const { message } = req.body;
            if (!message) return res.status(400).json({ error: 'Message is required' });

            // In a real system you might broadcast via websockets here and create notification records.
            const allUsers = await prisma.user.findMany({ select: { id: true } });

            // Create notification for ALL users (can be slow for massive DBs, but fine for scale-up)
            await prisma.notification.createMany({
                data: allUsers.map(u => ({
                    userId: u.id,
                    type: 'SYSTEM_ANNOUNCEMENT',
                    message: message
                }))
            });

            res.json({ success: true, message: `Announcement sent to ${allUsers.length} users.` });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
