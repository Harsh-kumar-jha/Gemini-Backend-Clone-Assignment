import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getMe, subscribePro, handleStripeWebhook, getSubscriptionStatus } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authMiddleware, getMe);

// Initiate Pro subscription via Stripe Checkout
router.post('/subscribe/pro', authMiddleware, subscribePro);

// Stripe webhook endpoint (no auth)
router.post('/webhook/stripe', handleStripeWebhook);

// Subscription status endpoint (auth required)
router.get('/subscription/status', authMiddleware, getSubscriptionStatus);

export default router; 