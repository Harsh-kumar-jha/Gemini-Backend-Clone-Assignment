import { Router } from 'express';
import {
  signup,
  sendOtpController,
  verifyOtpController,
  forgotPasswordController,
  changePasswordController
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.post('/forgot-password', forgotPasswordController);
router.post('/change-password', authMiddleware, changePasswordController);

export default router; 