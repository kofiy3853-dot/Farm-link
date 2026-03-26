import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { getIO } from "../../socket/index.js";

export class LogisticsController {
    // 1. Get all OPEN delivery requests
    static async getAvailableRoutes(req: Request, res: Response) {
        try {
            const routes = await prisma.deliveryRoute.findMany({
                where: { routeStatus: 'PENDING' },
                include: {
                    order: {
                        include: {
                            product: { select: { name: true, imageUrls: true } },
                            customer: { select: { name: true, email: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(routes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 2. Get my assigned routes
    static async getMyRoutes(req: Request, res: Response) {
        try {
            // @ts-ignore
            const driverId = req.user.id;
            const routes = await prisma.deliveryRoute.findMany({
                where: { driverId },
                include: {
                    order: {
                        include: {
                            product: { select: { name: true, imageUrls: true } }
                        }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            });
            res.json(routes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 3. Accept a route
    static async acceptRoute(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { vehicleId } = req.body;
            // @ts-ignore
            const driverId = req.user.id;

            const existing = await prisma.deliveryRoute.findUnique({ where: { id } });
            if (!existing || existing.routeStatus !== 'PENDING') {
                return res.status(400).json({ error: "Route unavailable or already assigned." });
            }

            const route = await prisma.deliveryRoute.update({
                where: { id },
                data: {
                    driverId,
                    ...(vehicleId && { vehicleId }),
                    routeStatus: 'ACCEPTED'
                }
            });

            // Notify Customer & Farmer via Sockets
            const io = getIO();
            const order = await prisma.order.findUnique({ where: { id: existing.orderId }, include: { product: true } });
            if (order) {
                io.to(order.customerId).emit('notification', { type: 'logistics', message: `A truck has been assigned to Order #${order.id.slice(0, 8)}` });
                io.to(order.product.farmerId).emit('notification', { type: 'logistics', message: `A truck is en-route for pickup for Order #${order.id.slice(0, 8)}` });
            }

            res.json(route);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 4. Update status (AT_PICKUP -> IN_TRANSIT -> DELIVERED)
    static async updateRouteStatus(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { routeStatus, driverNotes, proofOfDeliveryUrl } = req.body;

            // @ts-ignore
            const driverId = req.user.id;

            const route = await prisma.deliveryRoute.update({
                where: { id, driverId },
                data: {
                    routeStatus,
                    ...(driverNotes && { driverNotes }),
                    ...(proofOfDeliveryUrl && { proofOfDeliveryUrl }),
                    ...(routeStatus === 'DELIVERED' ? { actualDelivery: new Date() } : {})
                }
            });

            // If delivered, let's also auto-update the main Order status
            if (routeStatus === 'DELIVERED') {
                await prisma.order.update({
                    where: { id: route.orderId },
                    data: { status: 'delivered' }
                });
            }

            res.json(route);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 5. Update live tracking location
    static async updateLocation(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const { lat, lng } = req.body;
            // @ts-ignore
            const driverId = req.user.id;

            const route = await prisma.deliveryRoute.update({
                where: { id, driverId },
                data: { currentLat: lat, currentLng: lng }
            });

            // Re-broadcast Live Maps
            const io = getIO();
            io.to(route.orderId).emit('truck_location', { lat, lng, routeId: route.id });

            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
