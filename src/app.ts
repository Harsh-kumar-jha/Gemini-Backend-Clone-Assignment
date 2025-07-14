import './loadEnv.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectRedis } from './utils/redis.util.js';
import { authRoutes, userRoutes } from './routes/index.js';

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

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
