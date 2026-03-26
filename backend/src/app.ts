import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/authRoutes.js';
import productsRoutes from "./modules/products/productRoutes.js";
import ordersRoutes from "./modules/orders/orderRoutes.js";
import chatRoutes from "./modules/chat/chatRoutes.js";
import notificationRoutes from "./modules/notifications/notifyRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import adminRoutes from "./modules/admin/adminRoutes.js";
import walletRoutes from "./modules/wallet/walletRoutes.js";
import disputeRoutes from "./modules/disputes/disputeRoutes.js";
import logisticsRoutes from "./modules/logistics/logisticsRoutes.js";
import vehicleRoutes from "./modules/vehicles/vehicleRoutes.js";
import warehouseRoutes from "./modules/warehouses/warehouseRoutes.js";
import insightsRoutes from "./modules/insights/insightsRoutes.js";
import agricNewsRoutes from "./modules/agric-news/agricNewsRoutes.js";
import healthRoutes from "./routes/health.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimitMiddleware.js";
import logger from "./config/logger.js";
import { initNewsScheduler } from "./modules/agric-news/agricNewsFetcher.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// ... existing code ...
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'http://localhost:3001'
    : function (origin: any, callback: any) {
      if (!origin) return callback(null, true);
      const isLocalhost = origin.includes('localhost');
      const isLocalNetwork = /^http:\/\/(192\.168\.|172\.20\.|10\.)/.test(origin);
      if (isLocalhost || isLocalNetwork) return callback(null, true);
      const whitelist = ['http://localhost:3001', 'http://localhost:3000'];
      if (whitelist.indexOf(origin) !== -1) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use(apiLimiter);
app.use('/', healthRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/agric-news', agricNewsRoutes);

// Initialize Background Workers
initNewsScheduler();

app.get('/', (req, res) => {
  res.send('FarmLink API is running');
});

app.use(errorHandler);

export default app;