import { Router } from 'express';
import { generateTextController } from '../controllers/gemini.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { rateLimitMiddleware } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/generate', authMiddleware, rateLimitMiddleware, generateTextController);

export default router; 