import type { Request, Response } from "express";
import { DisputeService } from "./disputeService.js";

export class DisputeController {
    static async raiseDispute(req: Request, res: Response) {
        try {
            const { orderId, reason, evidenceUrl } = req.body;
            // @ts-ignore
            const userId = req.user.id;

            const dispute = await DisputeService.raiseDispute(
                orderId,
                userId,
                reason,
                evidenceUrl
            );

            res.status(201).json(dispute);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserDisputes(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const disputes = await DisputeService.getDisputesByUser(userId);
            res.status(200).json(disputes);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getDisputeById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dispute = await DisputeService.getDisputeById(id as string);

            if (!dispute) {
                return res.status(404).json({ error: "Dispute not found" });
            }

            res.status(200).json(dispute);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resolveDispute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { resolution, adminNotes } = req.body;

            // @ts-ignore
            const adminId = req.user.id;

            const result = await DisputeService.resolveDispute(id as string, resolution, adminNotes, adminId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
