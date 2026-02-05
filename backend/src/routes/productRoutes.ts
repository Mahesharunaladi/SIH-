import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductSchema,
  updateProductSchema,
} from '../controllers/productController';
import { UserRole } from '../types';

const router = express.Router();

const idSchema = z.object({ id: z.string().uuid() });

// Public routes (for traceability)
router.get('/', asyncHandler(getProducts));
router.get('/:id', validateParams(idSchema), asyncHandler(getProductById));

// Protected routes
router.post(
  '/',
  authenticate,
  authorize(UserRole.FARMER, UserRole.MANUFACTURER, UserRole.ADMIN),
  validateBody(createProductSchema),
  asyncHandler(createProduct)
);

router.put(
  '/:id',
  authenticate,
  validateParams(idSchema),
  validateBody(updateProductSchema),
  asyncHandler(updateProduct)
);

router.delete(
  '/:id',
  authenticate,
  validateParams(idSchema),
  asyncHandler(deleteProduct)
);

export default router;
