import express from 'express';
import { optionalAuth } from '../middleware/auth';
import { validateParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import {
  getProductTrace,
  getTraceByQR,
  getDashboardStats,
} from '../controllers/traceController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

const productIdSchema = z.object({ productId: z.string().uuid() });
const qrCodeSchema = z.object({ qrCode: z.string() });

// Get complete trace for a product (public with optional auth for scan tracking)
router.get(
  '/product/:productId',
  optionalAuth,
  validateParams(productIdSchema),
  asyncHandler(getProductTrace)
);

// Get trace by QR code
router.get(
  '/qr/:qrCode',
  optionalAuth,
  validateParams(qrCodeSchema),
  asyncHandler(getTraceByQR)
);

// Get dashboard statistics (protected)
router.get('/dashboard/stats', authenticate, asyncHandler(getDashboardStats));

export default router;
