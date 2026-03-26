import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/health', async (req, res) => {
    try {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;

        const healthCheck = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            database: 'connected',
        };

        res.status(200).json(healthCheck);
    } catch (error) {
        const healthCheck = {
            status: 'error',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
        };

        res.status(503).json(healthCheck);
    }
});

export default router;
