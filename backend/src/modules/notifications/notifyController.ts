import type { Request, Response } from "express";
import { NotificationService } from "./notifyService.js";

export class NotificationController {
    static async getNotifications(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const notifications = await NotificationService.getUserNotifications(userId);
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async markAsRead(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing notification id" });

            const notification = await NotificationService.markAsRead(id);
            res.json(notification);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteNotification(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing notification id" });

            await NotificationService.deleteNotification(id);
            res.json({ message: "Notification deleted" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
