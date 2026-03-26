import type { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export class AgricNewsController {
    // 1. Get Latest Agric News
    static async getLatestNews(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;

            const news = await prisma.agricNews.findMany({
                orderBy: { published_at: 'desc' },
                take: limit,
            });

            res.json({ news });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 2. Get News By Category
    static async getNewsByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            const limit = parseInt(req.query.limit as string) || 20;

            const baseCategory = category ? String(category).trim() : 'Crops';

            const news = await prisma.agricNews.findMany({
                where: {
                    category: {
                        contains: baseCategory,
                        mode: 'insensitive'
                    }
                },
                orderBy: { published_at: 'desc' },
                take: limit,
            });

            res.json({ news });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 3. Get Single News Article 
    static async getNewsArticle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const article = await prisma.agricNews.findFirst({
                where: { id: id || '' }
            });

            if (!article) return res.status(404).json({ error: 'Article not found' });

            res.json({ article });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
