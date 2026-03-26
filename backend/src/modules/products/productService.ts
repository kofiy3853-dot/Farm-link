import { prisma } from "../../config/prisma.js";
import fs from "fs";

export class ProductService {
    static async createProduct(data: {
        farmerId: string;
        name: string;
        price: number;
        description?: string | undefined;
        category?: any | undefined;
        imagePaths?: string[] | undefined;
        videoPath?: string | undefined;
        region?: string | undefined;
        availableQuantity?: number | undefined;
        minOrderQuantity?: number | undefined;
        qualityGrade?: string | undefined;
        isOrganic?: boolean | undefined;
        harvestDate?: Date | undefined;
        isSoldOut?: boolean | undefined;
    }) {
        let imageUrls: string[] = [];
        let videoUrl: string | undefined;
        const { default: cloudinary } = await import("../../config/cloudinary.js");

        if (data.imagePaths && data.imagePaths.length > 0) {
            const uploadPromises = data.imagePaths.map(async (imgPath) => {
                const uploadResult = await cloudinary.uploader.upload(imgPath, { folder: "farmlink/products" });
                fs.unlinkSync(imgPath);
                return uploadResult.secure_url;
            });
            imageUrls = await Promise.all(uploadPromises);
        }

        if (data.videoPath) {
            const uploadResult = await cloudinary.uploader.upload(data.videoPath, { folder: "farmlink/products/videos", resource_type: "video" });
            videoUrl = uploadResult.secure_url;
            fs.unlinkSync(data.videoPath);
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                farmerId: data.farmerId,
                ...(data.description !== undefined ? { description: data.description } : {}),
                ...(data.category !== undefined ? { category: data.category } : {}),
                ...(imageUrls.length > 0 ? { imageUrls } : {}),
                ...(videoUrl !== undefined ? { videoUrl } : {}),
                ...(data.region !== undefined ? { region: data.region } : {}),
                ...(data.availableQuantity !== undefined ? { availableQuantity: data.availableQuantity } : {}),
                ...(data.minOrderQuantity !== undefined ? { minOrderQuantity: data.minOrderQuantity } : {}),
                ...(data.qualityGrade !== undefined ? { qualityGrade: data.qualityGrade } : {}),
                ...(data.isOrganic !== undefined ? { isOrganic: data.isOrganic } : {}),
                ...(data.harvestDate !== undefined ? { harvestDate: data.harvestDate } : {}),
                ...(data.isSoldOut !== undefined ? { isSoldOut: data.isSoldOut } : {}),
            },
        });

        // Notify all buyers of new harvest
        try {
            const buyers = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, select: { id: true } });
            const notifications = buyers.map(b => ({
                userId: b.id,
                type: 'NEW_HARVEST',
                message: `New Harvest Alert: ${product.name} is now available!`
            }));
            if (notifications.length > 0) {
                await prisma.notification.createMany({ data: notifications });
            }
        } catch (e) {
            console.error("Failed to broadcast new harvest notification", e);
        }

        return product;
    }

    static async getAllProducts(filters?: any) {
        // Build dynamic where clause based on V2 filter specifications
        const where: any = {};

        if (filters?.category) where.category = filters.category;
        if (filters?.region) where.region = filters.region;
        if (filters?.qualityGrade) where.qualityGrade = filters.qualityGrade;
        if (filters?.isOrganic !== undefined) where.isOrganic = filters.isOrganic === 'true' || filters.isOrganic === true;
        if (filters?.farmerId) where.farmerId = filters.farmerId;

        // Price Range
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
            if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
        }

        // Bulk Quantity Range
        if (filters?.minBulkQuantity) {
            where.availableQuantity = { gte: parseInt(filters.minBulkQuantity, 10) };
        }

        // Search Query
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { farmer: { name: { contains: filters.search, mode: 'insensitive' } } }
            ];
        }

        // Sorting Logic
        let orderBy: any = { createdAt: 'desc' };
        if (filters?.sort === 'lowest_price') orderBy = { price: 'asc' };
        if (filters?.sort === 'highest_qty') orderBy = { availableQuantity: 'desc' };
        if (filters?.sort === 'most_trusted') orderBy = { farmer: { rating: 'desc' } };

        return prisma.product.findMany({
            where,
            orderBy,
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        isVerified: true,
                        rating: true,
                        totalSales: true
                    },
                },
            },
        });
    }

    static async getProductById(id: string) {
        return prisma.product.findUnique({
            where: {
                id,
            },
        });
    }

    static async updateProduct(
        id: string,
        name?: string,
        price?: number,
        description?: string,
        category?: any,
        imagePaths?: string[],
        videoPath?: string,
        isSoldOut?: boolean,
        region?: string,
        availableQuantity?: number,
        minOrderQuantity?: number,
        qualityGrade?: string,
        isOrganic?: boolean,
        harvestDate?: Date,
        imageOrder?: string[] // V2: Order of existing images
    ) {
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) throw new Error("Product not found");

        const isPriceDrop = price !== undefined && price < existingProduct.price;

        const { default: cloudinary } = await import("../../config/cloudinary.js");

        // V2: Start with the requested order of existing images
        let finalImageUrls = imageOrder || existingProduct.imageUrls || [];

        // Upload new images and append them
        if (imagePaths && imagePaths.length > 0) {
            const uploadPromises = imagePaths.map(async (imgPath) => {
                const uploadResult = await cloudinary.uploader.upload(imgPath, { folder: "farmlink/products" });
                fs.unlinkSync(imgPath);
                return uploadResult.secure_url;
            });
            const newUrls = await Promise.all(uploadPromises);
            finalImageUrls = [...finalImageUrls, ...newUrls];
        }

        // Limit to 10 images total
        finalImageUrls = finalImageUrls.slice(0, 10);

        let videoUrl: string | undefined;
        if (videoPath) {
            const uploadResult = await cloudinary.uploader.upload(videoPath, { folder: "farmlink/products/videos", resource_type: "video" });
            videoUrl = uploadResult.secure_url;
            fs.unlinkSync(videoPath);
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(price !== undefined ? { price } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(category !== undefined ? { category } : {}),
                ...(finalImageUrls.length > 0 ? { imageUrls: finalImageUrls } : {}),
                ...(videoUrl !== undefined ? { videoUrl } : {}),
                ...(isSoldOut !== undefined ? { isSoldOut } : {}),
                ...(region !== undefined ? { region } : {}),
                ...(availableQuantity !== undefined ? { availableQuantity } : {}),
                ...(minOrderQuantity !== undefined ? { minOrderQuantity } : {}),
                ...(qualityGrade !== undefined ? { qualityGrade } : {}),
                ...(isOrganic !== undefined ? { isOrganic } : {}),
                ...(harvestDate !== undefined ? { harvestDate } : {}),
            },
        });

        if (isPriceDrop) {
            try {
                const buyers = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, select: { id: true } });
                const notifications = buyers.map(b => ({
                    userId: b.id,
                    type: 'PRICE_DROP',
                    message: `Price Drop Alert: ${product.name} is now ${product.price.toLocaleString()} GHS!`
                }));
                if (notifications.length > 0) {
                    await prisma.notification.createMany({ data: notifications });
                }
            } catch (e) {
                console.error("Failed to broadcast price drop notification", e);
            }
        }

        return product;
    }

    static async getProductsByfarmer(farmerId: string) {
        return prisma.product.findMany({
            where: {
                farmerId,
            },
        });
    }

    static async deleteProduct(id: string) {
        return prisma.product.delete({
            where: {
                id,
            },
        });
    }
}