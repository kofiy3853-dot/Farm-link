import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

export class VehicleController {
    // 1. Create a new vehicle
    static async createVehicle(req: Request, res: Response) {
        try {
            // @ts-ignore
            const ownerId = req.user.id;
            const { licensePlate, vehicleType, capacityMT, isColdStorage, insuranceExpiry } = req.body;

            const vehicle = await prisma.vehicle.create({
                data: {
                    ownerId,
                    licensePlate,
                    vehicleType,
                    capacityMT: parseFloat(capacityMT),
                    isColdStorage,
                    ...(insuranceExpiry && { insuranceExpiry: new Date(insuranceExpiry) })
                }
            });

            res.status(201).json(vehicle);
        } catch (error: any) {
            // Handle unique constraint on licensePlate
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "License plate already registered." });
            }
            res.status(500).json({ error: error.message });
        }
    }

    // 2. Get my vehicles
    static async getMyVehicles(req: Request, res: Response) {
        try {
            // @ts-ignore
            const ownerId = req.user.id;

            const vehicles = await prisma.vehicle.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'desc' }
            });

            res.json(vehicles);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 3. Update vehicle
    static async updateVehicle(req: Request<{ id: string }>, res: Response) {
        try {
            // @ts-ignore
            const ownerId = req.user.id;
            const { id } = req.params;
            const { vehicleType, capacityMT, isColdStorage, insuranceExpiry, status } = req.body;

            const existing = await prisma.vehicle.findUnique({ where: { id } });
            if (!existing || existing.ownerId !== ownerId) {
                return res.status(404).json({ error: "Vehicle not found" });
            }

            const vehicle = await prisma.vehicle.update({
                where: { id },
                data: {
                    ...(vehicleType && { vehicleType }),
                    ...(capacityMT !== undefined && { capacityMT: parseFloat(capacityMT) }),
                    ...(isColdStorage !== undefined && { isColdStorage }),
                    ...(insuranceExpiry && { insuranceExpiry: new Date(insuranceExpiry) }),
                    ...(status && { status })
                }
            });

            res.json(vehicle);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 4. Delete vehicle
    static async deleteVehicle(req: Request<{ id: string }>, res: Response) {
        try {
            // @ts-ignore
            const ownerId = req.user.id;
            const { id } = req.params;

            const existing = await prisma.vehicle.findUnique({ where: { id } });
            if (!existing || existing.ownerId !== ownerId) {
                return res.status(404).json({ error: "Vehicle not found" });
            }

            await prisma.vehicle.delete({ where: { id } });

            res.json({ message: "Vehicle deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
