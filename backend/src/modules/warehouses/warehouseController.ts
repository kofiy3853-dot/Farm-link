import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

export class WarehouseController {
    // 1. Create a warehouse
    static async createWarehouse(req: Request, res: Response) {
        try {
            // @ts-ignore
            const managerId = req.user.id;
            const { name, location, totalCapacityMT, hasColdStorage, operatingHours, pricingPerMT } = req.body;

            const warehouse = await prisma.warehouse.create({
                data: {
                    managerId,
                    name,
                    location,
                    totalCapacityMT: parseFloat(totalCapacityMT),
                    hasColdStorage,
                    operatingHours,
                    pricingPerMT: parseFloat(pricingPerMT || 0)
                }
            });

            res.status(201).json(warehouse);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 2. Get my warehouses
    static async getMyWarehouses(req: Request, res: Response) {
        try {
            // @ts-ignore
            const managerId = req.user.id;

            const warehouses = await prisma.warehouse.findMany({
                where: { managerId },
                include: {
                    inventories: true
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json(warehouses);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 3. Update a warehouse
    static async updateWarehouse(req: Request<{ id: string }>, res: Response) {
        try {
            // @ts-ignore
            const managerId = req.user.id;
            const { id } = req.params;
            const { name, location, totalCapacityMT, hasColdStorage, operatingHours, pricingPerMT } = req.body;

            const existing = await prisma.warehouse.findUnique({ where: { id } });
            if (!existing || existing.managerId !== managerId) {
                return res.status(404).json({ error: "Warehouse not found" });
            }

            const warehouse = await prisma.warehouse.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(location && { location }),
                    ...(totalCapacityMT !== undefined && { totalCapacityMT: parseFloat(totalCapacityMT) }),
                    ...(hasColdStorage !== undefined && { hasColdStorage }),
                    ...(operatingHours && { operatingHours }),
                    ...(pricingPerMT !== undefined && { pricingPerMT: parseFloat(pricingPerMT) })
                }
            });

            res.json(warehouse);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 4. Record new incoming inventory into a warehouse
    static async addInventory(req: Request<{ warehouseId: string }>, res: Response) {
        try {
            // @ts-ignore
            const managerId = req.user.id;
            const { warehouseId } = req.params;
            const { ownerId, productName, quantityMT, expiryDate } = req.body;

            const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
            if (!warehouse || warehouse.managerId !== managerId) {
                return res.status(404).json({ error: "Warehouse not found" });
            }

            // Check if capacity allows
            if (warehouse.usedCapacityMT + parseFloat(quantityMT) > warehouse.totalCapacityMT) {
                return res.status(400).json({ error: "Not enough warehouse capacity" });
            }

            // Transaction: create inventory record and update warehouse used capacity
            const result = await prisma.$transaction([
                prisma.warehouseInventory.create({
                    data: {
                        warehouseId,
                        ownerId,
                        productName,
                        quantityMT: parseFloat(quantityMT),
                        ...(expiryDate && { expiryDate: new Date(expiryDate) })
                    }
                }),
                prisma.warehouse.update({
                    where: { id: warehouseId },
                    data: { usedCapacityMT: { increment: parseFloat(quantityMT) } }
                })
            ]);

            res.status(201).json(result[0]);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 5. Dispatch or checkout inventory from warehouse
    static async dispatchInventory(req: Request<{ warehouseId: string, inventoryId: string }>, res: Response) {
        try {
            // @ts-ignore
            const managerId = req.user.id;
            const { warehouseId, inventoryId } = req.params;

            const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
            if (!warehouse || warehouse.managerId !== managerId) {
                return res.status(404).json({ error: "Warehouse not found" });
            }

            const inventory = await prisma.warehouseInventory.findUnique({ where: { id: inventoryId } });
            if (!inventory || inventory.warehouseId !== warehouseId || inventory.status === "DISPATCHED") {
                return res.status(404).json({ error: "Active inventory record not found" });
            }

            // Transaction: mark inventory as dispatched and reduce warehouse used capacity
            const result = await prisma.$transaction([
                prisma.warehouseInventory.update({
                    where: { id: inventoryId },
                    data: { status: "DISPATCHED" }
                }),
                prisma.warehouse.update({
                    where: { id: warehouseId },
                    data: { usedCapacityMT: { decrement: inventory.quantityMT } }
                })
            ]);

            res.json(result[0]);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
