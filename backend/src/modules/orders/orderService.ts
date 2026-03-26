import { prisma } from "../../config/prisma.js";
import { NotificationService } from "../notifications/notifyService.js";
import { getIO } from "../../socket/index.js";
import { OrderStatus } from "@prisma/client";

export class OrderService {
  static async createOrder(
    customerId: string,
    productId: string,
    quantity: number,
    paymentMethod?: string,
    logisticsPartner?: string,
    deliveryCost?: number,
    deliveryRegion?: string,
    isRecurring: boolean = false,
    recurringInterval: string | null = null
  ) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const totalPrice = (product.price * quantity) + (deliveryCost || 0);

    // V4 Escrow Deduction Logic
    if (paymentMethod === 'escrow') {
      const buyerWallet = await prisma.wallet.findUnique({ where: { userId: customerId } });
      if (!buyerWallet || buyerWallet.balance < totalPrice) {
        throw new Error("Insufficient wallet balance for Escrow Checkout. Please load funds.");
      }

      // Deduct from buyer
      await prisma.wallet.update({
        where: { id: buyerWallet.id },
        data: { balance: { decrement: totalPrice } }
      });

      // Log transaction
      await prisma.transaction.create({
        data: {
          walletId: buyerWallet.id,
          amount: totalPrice,
          type: "ESCROW_HOLD",
          status: "COMPLETED",
          description: `Escrow Hold for Order: ${product.name} (${quantity} MT)`
        }
      });
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        productId,
        quantity,
        totalprice: totalPrice,
        ...(paymentMethod && { paymentMethod }),
        ...(logisticsPartner && { logisticsPartner }),
        ...(deliveryCost !== undefined && { deliveryCost }),
        ...(deliveryRegion && { deliveryRegion }),
        isRecurring,
        ...(recurringInterval && { recurringInterval })
      },
      include: {
        product: { include: { farmer: { select: { id: true, name: true, email: true } } } },
      },
    });

    // Create notifications in database
    await NotificationService.createNotification(
      order.customerId,
      "order",
      "Your order has been created"
    );

    if (order.product.farmer?.id) {
      await NotificationService.createNotification(
        order.product.farmer.id,
        "order",
        "A new order has been placed"
      );

      // Send real-time notification via Socket.io
      const io = getIO();
      io.to(order.product.farmer.id).emit("notification", {
        type: "order",
        message: "A new order has been placed",
        timestamp: new Date(),
      });

      // Update Escrow Wallet
      if (order.paymentMethod?.toUpperCase() === 'ESCROW') {
        await prisma.wallet.upsert({
          where: { userId: order.product.farmer.id },
          create: { userId: order.product.farmer.id, escrowBalance: order.totalprice, balance: 0 },
          update: { escrowBalance: { increment: order.totalprice } }
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'HELD' }
        });
      }
    }

    // V5: Create an unassigned DeliveryRoute for logistics partners to accept
    if (deliveryRegion && deliveryRegion !== "Self Pickup") {
      await prisma.deliveryRoute.create({
        data: {
          orderId: order.id,
          pickupLocation: order.product.region || "Accra Central",
          pickupLat: 5.6037,
          pickupLng: -0.1870,
          dropoffLocation: deliveryRegion,
          dropoffLat: 5.6667,
          dropoffLng: 0.0,
          routeStatus: "PENDING"
        }
      }).catch(err => console.error("Failed to generate DeliveryRoute payload", err));
    }

    return order;
  }

  static async getCustomerOrders(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getFarmerOrders(farmerId: string) {
    return prisma.order.findMany({
      where: { product: { farmerId } },
      include: { product: true, customer: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true }
    });

    if (!existingOrder) throw new Error("Order not found");

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // @ts-ignore
    if (status === 'completed' && existingOrder.paymentMethod === 'ESCROW' && existingOrder.paymentStatus !== 'RELEASED') {
      const farmerId = existingOrder.product.farmerId;
      await prisma.$transaction(async (tx) => {
        // @ts-ignore
        const wallet = await tx.wallet.findUnique({ where: { userId: farmerId } });
        if (wallet && wallet.escrowBalance >= order.totalprice) {
          // @ts-ignore
          await tx.wallet.update({
            where: { userId: farmerId },
            data: {
              escrowBalance: { decrement: order.totalprice },
              balance: { increment: order.totalprice }
            }
          });

          // @ts-ignore
          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              amount: order.totalprice,
              type: 'ESCROW_RELEASE',
              status: 'COMPLETED',
              reference: order.id,
              description: `Escrow release for Order #${order.id.slice(0, 8)}`
            }
          });

          await tx.order.update({
            where: { id: order.id },
            // @ts-ignore
            data: { paymentStatus: 'RELEASED' }
          });
        }
      });
    }

    // Trigger Notification to Buyer
    try {
      let msg = `Your order for ${existingOrder.product.name} is now ${status}.`;
      if (status === 'shipped') msg = `Your order for ${existingOrder.product.name} has been shipped and is on the way!`;
      if (status === 'delivered') msg = `Your order for ${existingOrder.product.name} has been delivered. Please confirm receipt to release Escrow.`;

      await NotificationService.createNotification(
        existingOrder.customerId,
        "ORDER_UPDATE",
        msg
      );
    } catch (err) {
      console.error("Failed to send order update notification", err);
    }

    return order;
  }

  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            farmer: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async cancelOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });
  }

  static async getAllOrders(skip: number, take: number) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        include: {
          product: true,
          customer: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count(),
    ]);

    return { orders, total };
  }
}