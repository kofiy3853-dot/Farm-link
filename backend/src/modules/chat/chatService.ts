import { prisma } from "../../config/prisma.js";

export class ChatService {
    static async getUserChats(userId: string) {
        return prisma.chat.findMany({
            where: {
                customerId: userId,
            },
            include: {
                product: {
                    include: {
                        farmer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
    }

    static async getChatById(id: string) {
        return prisma.chat.findUnique({
            where: { id },
            include: {
                product: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    static async createChat(customerId: string, productId: string) {
        // Check if chat already exists
        const existingChat = await prisma.chat.findFirst({
            where: {
                customerId,
                productId,
            },
        });

        if (existingChat) {
            return existingChat;
        }

        return prisma.chat.create({
            data: {
                customerId,
                productId,
            },
            include: {
                product: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    static async getChatMessages(chatId: string) {
        return prisma.message.findMany({
            where: { chatId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    static async sendMessage(chatId: string, senderId: string, content: string) {
        return prisma.message.create({
            data: {
                chatId,
                senderId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}
