import express from 'express';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import {
  register,
  login,
  getProfile,
  updateProfile,
  verifyEmail,
  resendVerification,
  registerSchema,
  loginSchema,
} from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', validateBody(registerSchema), asyncHandler(register));
router.post('/login', validateBody(loginSchema), asyncHandler(login));
router.post('/verify-email', asyncHandler(verifyEmail));
router.post('/resend-verification', asyncHandler(resendVerification));

// Protected routes
router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', authenticate, asyncHandler(updateProfile));

export default router;
