import type { Request, Response } from "express";
import { OrderService } from "./orderService.js";

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const { productId, quantity, paymentMethod, logisticsPartner, deliveryCost, deliveryRegion, isRecurring, recurringInterval } = req.body;
      // @ts-ignore
      const customerId = req.user.id;

      const order = await OrderService.createOrder(
        customerId,
        productId,
        parseInt(quantity),
        paymentMethod,
        logisticsPartner,
        deliveryCost ? parseFloat(deliveryCost) : 0,
        deliveryRegion,
        isRecurring || false,
        recurringInterval || null
      );
      res.status(201).json(order);
    } catch (error: any) {
      console.error("ORDER CREATE ERROR:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getCustomerOrders(req: Request, res: Response) {
    try {
      // @ts-ignore
      const customerId = req.user.id;
      const orders = await OrderService.getCustomerOrders(customerId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFarmerOrders(req: Request, res: Response) {
    try {
      // @ts-ignore
      const farmerId = req.user.id;
      const orders = await OrderService.getFarmerOrders(farmerId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const rawStatus = req.body.status;

      if (!id) {
        return res.status(400).json({ error: "Order id is required" });
      }

      const allowedStatuses = [
        "pending",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "disputed",
      ] as const;

      if (
        typeof rawStatus !== "string" ||
        !allowedStatuses.some((s) => s === rawStatus)
      ) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const status = rawStatus as (typeof allowedStatuses)[number];
      const order = await OrderService.updateOrderStatus(id, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      const order = await OrderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      const order = await OrderService.cancelOrder(id);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const { orders, total } = await OrderService.getAllOrders(skip, limit);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}