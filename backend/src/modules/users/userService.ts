import { prisma } from "../../config/prisma.js";

export class UserService {
    static async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                createdAt: true,
                isVerified: true,
                rating: true,
                totalSales: true,
                farmName: true,
                farmSize: true,
                experienceYears: true,
                certifications: true,
                district: true,
            },
        });
    }

    static async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    static async updateUser(
        id: string,
        data: {
            name?: string;
            email?: string;
            farmName?: string;
            farmSize?: number;
            experienceYears?: number;
            certifications?: any;
            district?: string;

            // Buyer & Logistics
            businessName?: string;
            industryType?: string;
            businessLicense?: string;
            fleetSize?: number;
            vehicleTypes?: any;
            serviceRegions?: any;
        }
    ) {
        return prisma.user.update({
            where: { id },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.email !== undefined ? { email: data.email } : {}),
                ...(data.farmName !== undefined ? { farmName: data.farmName } : {}),
                ...(data.farmSize !== undefined ? { farmSize: data.farmSize } : {}),
                ...(data.experienceYears !== undefined ? { experienceYears: data.experienceYears } : {}),
                ...(data.certifications !== undefined ? { certifications: data.certifications } : {}),
                ...(data.district !== undefined ? { district: data.district } : {}),

                ...(data.businessName !== undefined ? { businessName: data.businessName } : {}),
                ...(data.industryType !== undefined ? { industryType: data.industryType } : {}),
                ...(data.businessLicense !== undefined ? { businessLicense: data.businessLicense } : {}),
                ...(data.fleetSize !== undefined ? { fleetSize: data.fleetSize } : {}),
                ...(data.vehicleTypes !== undefined ? { vehicleTypes: data.vehicleTypes } : {}),
                ...(data.serviceRegions !== undefined ? { serviceRegions: data.serviceRegions } : {}),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                createdAt: true,
                isVerified: true,
                rating: true,
                totalSales: true,
                farmName: true,
                farmSize: true,
                experienceYears: true,
                certifications: true,
                district: true,
            },
        });
    }

    static async getAllUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    }

    static async getFarmers() {
        return prisma.user.findMany({
            where: { role: 'FARMER' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isVerified: true,
                rating: true,
                totalSales: true,
                farmName: true,
                farmSize: true,
                experienceYears: true,
                certifications: true,
                district: true,
            }
        });
    }

    static async getFarmerAnalytics(farmerId: string) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await prisma.order.findMany({
            where: {
                product: { farmerId },
                createdAt: { gte: thirtyDaysAgo }
            },
            include: { product: true }
        });

        const revenueTrend: Record<string, number> = {};
        let totalRevenue = 0;
        let pendingOrders = 0;
        let activeOrders = 0;
        let completedOrders = 0;
        const regionCount: Record<string, number> = {};

        orders.forEach((order: any) => {
            if (order.status !== 'cancelled') {
                const dateKey = order.createdAt.toISOString().split('T')[0] as string;
                revenueTrend[dateKey] = (revenueTrend[dateKey] || 0) + order.totalprice;
                totalRevenue += order.totalprice;

                const region = order.deliveryRegion || 'Unknown';
                regionCount[region] = (regionCount[region] || 0) + 1;
            }

            if (order.status === 'pending') pendingOrders++;
            else if (['processing', 'packed', 'shipped'].includes(order.status)) activeOrders++;
            else if (['delivered', 'completed'].includes(order.status)) completedOrders++;
        });

        // Fill trailing 30 days for continuous graph
        const trendData = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0] as string;
            trendData.push({
                date: dateStr,
                revenue: revenueTrend[dateStr] || 0
            });
        }

        const topRegions = Object.entries(regionCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return {
            totalRevenue,
            pendingOrders,
            activeOrders,
            completedOrders,
            revenueTrend: trendData,
            topRegions
        };
    }

    static async getBuyerAnalytics(buyerId: string) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await prisma.order.findMany({
            where: {
                customerId: buyerId,
                createdAt: { gte: thirtyDaysAgo }
            },
            include: { product: { include: { farmer: { select: { name: true } } } } }
        });

        const spendingTrend: Record<string, number> = {};
        let totalSpent = 0;
        let pendingOrders = 0;
        let activeOrders = 0;
        let completedOrders = 0;
        const cropCount: Record<string, number> = {};

        orders.forEach((order: any) => {
            if (order.status !== 'cancelled') {
                const dateKey = order.createdAt.toISOString().split('T')[0] as string;
                spendingTrend[dateKey] = (spendingTrend[dateKey] || 0) + order.totalprice;
                totalSpent += order.totalprice;

                const crop = order.product?.name || 'Unknown';
                cropCount[crop] = (cropCount[crop] || 0) + 1;
            }

            if (order.status === 'pending') pendingOrders++;
            else if (['processing', 'packed', 'shipped'].includes(order.status)) activeOrders++;
            else if (['delivered', 'completed'].includes(order.status)) completedOrders++;
        });

        // Fill trailing 30 days for continuous graph
        const trendData = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0] as string;
            trendData.push({
                date: dateStr,
                spent: spendingTrend[dateStr] || 0
            });
        }

        const topCrops = Object.entries(cropCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return {
            totalSpent,
            pendingOrders,
            activeOrders,
            completedOrders,
            spendingTrend: trendData,
            topCrops
        };
    }
}
