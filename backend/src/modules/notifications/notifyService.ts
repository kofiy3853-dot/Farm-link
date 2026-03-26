import { prisma } from "../../config/prisma.js";

export class NotificationService {
    static async getUserNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    static async markAsRead(id: string) {
        return prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    static async deleteNotification(id: string) {
        return prisma.notification.delete({
            where: { id },
        });
    }

    static async createNotification(
        userId: string,
        type: string,
        message: string
    ) {
        return prisma.notification.create({
            data: {
                userId,
                type,
                message,
            },
        });
    }
}