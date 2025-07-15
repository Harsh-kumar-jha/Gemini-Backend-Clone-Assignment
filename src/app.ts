import './loadEnv.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectRedis } from './utils/redis.util.js';
import { authRoutes, userRoutes, geminiRoutes, chatroomRoutes } from './routes/index.js';
import { env } from './configs/env.js';

// Logger setup
import logger from './utils/logger.util.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware.js';



const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream }));

// Connect to Redis
connectRedis().catch((err) => logger.error('Redis connection error', err));

// Routes
app.use('/auth', authRoutes);
app.use('/user', rateLimitMiddleware, userRoutes);
app.use('/gemini', geminiRoutes);
app.use('/chatroom', chatroomRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// After all services are initialized and app is listening
logger.banner({
  'Environment (.env)': true,
  'Database': true, 
  'Redis': true,
  'RabbitMQ': true,
  'Port': String(PORT),
});

export default app;

// Graceful shutdown and error handling for production
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
  process.exit(1);
});
