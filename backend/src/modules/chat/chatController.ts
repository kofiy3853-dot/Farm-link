import type { Request, Response } from "express";
import { ChatService } from "./chatService.js";

export class ChatController {
    static async getChats(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const chats = await ChatService.getUserChats(userId);
            res.json(chats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getChatById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing id" });
            const chat = await ChatService.getChatById(id);
            if (!chat) return res.status(404).json({ error: "Chat not found" });
            res.json(chat);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async createChat(req: Request, res: Response) {
        try {
            const { productId } = req.body;
            // @ts-ignore
            const customerId = req.user.id;

            if (!productId) {
                return res.status(400).json({ error: "Product ID is required" });
            }

            const chat = await ChatService.createChat(customerId, productId);
            res.status(201).json(chat);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getMessages(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing chat id" });
            const messages = await ChatService.getChatMessages(id);
            res.json(messages);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async sendMessage(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            // @ts-ignore
            const senderId = req.user.id;

            if (!id) return res.status(400).json({ error: "Missing chat id" });
            if (!content) return res.status(400).json({ error: "Message content is required" });

            const message = await ChatService.sendMessage(id, senderId, content);
            res.status(201).json(message);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
