import { Router } from 'express';
import { AgricNewsController } from './agricNewsController.js';

const router = Router();

// Get the latest general news
router.get('/', AgricNewsController.getLatestNews);
router.get('/latest', AgricNewsController.getLatestNews);

// Get news filtered by category
router.get('/category/:category', AgricNewsController.getNewsByCategory);

export default router;
