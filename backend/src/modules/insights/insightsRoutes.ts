import { Router } from 'express';
import { InsightsController } from './insightsController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const router = Router();

// Everyone can view market trends & heatmaps
router.get('/market', InsightsController.getMarketIntelligence);
router.get('/heatmap', InsightsController.getRegionalHeatmap);

// Public homepage stats
router.get('/homepage-stats', InsightsController.getHomepageStats);

// Admin-only intelligence dashboard
router.get('/admin-status', authenticate, InsightsController.getAdminEcosystemStatus);

// ASK FARM AI Chat
router.post('/chat', InsightsController.chatWithNana);

export default router;
