import express from 'express';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import {
  createEvent,
  getProductEvents,
  getEventById,
  verifyEvent,
  createEventSchema,
} from '../controllers/eventController';

const router = express.Router();

const idSchema = z.object({ id: z.string().uuid() });
const productIdSchema = z.object({ productId: z.string().uuid() });

// Get events for a product (public for traceability)
router.get('/product/:productId', validateParams(productIdSchema), asyncHandler(getProductEvents));

// Get event by ID
router.get('/:id', validateParams(idSchema), asyncHandler(getEventById));

// Verify event integrity
router.get('/:id/verify', validateParams(idSchema), asyncHandler(verifyEvent));

// Create event (protected)
router.post(
  '/',
  authenticate,
  validateBody(createEventSchema),
  asyncHandler(createEvent)
);

export default router;
