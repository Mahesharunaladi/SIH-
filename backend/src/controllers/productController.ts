import { Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { logger } from '../utils/logger';
import { blockchainService } from '../utils/blockchain';
import { generateQRCode } from '../utils/qr';
import { AuthRequest } from '../middleware/auth';
import { ProductStatus } from '../types';

// Validation schemas
export const createProductSchema = z.object({
  name: z.string().min(2),
  scientificName: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string(),
  harvestDate: z.string().optional(),
  batchNumber: z.string().optional(),
  originLatitude: z.number().optional(),
  originLongitude: z.number().optional(),
  originAccuracy: z.number().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  quantity: z.number().positive().optional(),
  status: z.enum(['HARVESTED', 'IN_PROCESSING', 'PROCESSED', 'PACKAGED', 'IN_TRANSIT', 'IN_WAREHOUSE', 'AVAILABLE', 'SOLD', 'RECALLED']).optional(),
});

/**
 * Create new product
 */
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await db.getClient();
  
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    await client.query('BEGIN');

    const {
      name,
      scientificName,
      description,
      category,
      quantity,
      unit,
      harvestDate,
      batchNumber,
      originLatitude,
      originLongitude,
      originAccuracy,
    } = req.body;

    const productId = uuidv4();

    // Generate QR code
    const qrCode = await generateQRCode(productId);

    // Insert product
    const productResult = await client.query(
      `INSERT INTO products (
        id, name, scientific_name, description, category, quantity, unit,
        status, current_owner_id, harvest_date, batch_number, qr_code,
        origin_latitude, origin_longitude, origin_accuracy
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        productId,
        name,
        scientificName,
        description,
        category,
        quantity,
        unit,
        'HARVESTED',
        req.user.id,
        harvestDate || new Date(),
        batchNumber,
        qrCode,
        originLatitude,
        originLongitude,
        originAccuracy,
      ]
    );

    const product = productResult.rows[0];

    // Create harvest event
    const eventData = {
      productId: product.id,
      eventType: 'HARVEST',
      performedBy: req.user.id,
      timestamp: new Date(),
      location: originLatitude && originLongitude ? {
        latitude: originLatitude,
        longitude: originLongitude,
        accuracy: originAccuracy,
      } : null,
      metadata: {
        quantity,
        unit,
        harvestDate,
      },
    };

    const dataHash = blockchainService.hashEvent(eventData);

    const eventResult = await client.query(
      `INSERT INTO supply_chain_events (
        product_id, event_type, performed_by, location_latitude,
        location_longitude, location_accuracy, description, metadata, data_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        product.id,
        'HARVEST',
        req.user.id,
        originLatitude,
        originLongitude,
        originAccuracy,
        `Harvested ${quantity} ${unit} of ${name}`,
        JSON.stringify(eventData.metadata),
        dataHash,
      ]
    );

    const eventId = eventResult.rows[0].id;

    // Anchor to blockchain
    const chainProof = await blockchainService.anchorToChain(dataHash);

    // Store blockchain transaction
    await client.query(
      `INSERT INTO blockchain_transactions (
        transaction_hash, block_number, block_timestamp, network,
        event_id, data_hash, gas_used, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        chainProof.transactionHash,
        chainProof.blockNumber,
        chainProof.blockTimestamp,
        chainProof.network || 'mock',
        eventId,
        dataHash,
        chainProof.gasUsed,
        'confirmed',
      ]
    );

    await client.query('COMMIT');

    logger.info('Product created', { productId: product.id, userId: req.user.id });

    res.status(201).json({
      success: true,
      data: {
        product,
        blockchainProof: chainProof,
      },
      message: 'Product created and anchored to blockchain',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    logger.error('Create product error', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  } finally {
    client.release();
  }
};

/**
 * Get all products (with filtering and pagination)
 */
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as ProductStatus;
    const ownerId = req.query.ownerId as string;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (ownerId) {
      query += ` AND current_owner_id = $${paramCount}`;
      params.push(ownerId);
      paramCount++;
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM products WHERE 1=1${status ? ' AND status = $1' : ''}${ownerId ? ' AND current_owner_id = $' + (status ? '2' : '1') : ''}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Get products error', error);
    res.status(500).json({ success: false, error: 'Failed to get products' });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Get product error', error);
    res.status(500).json({ success: false, error: 'Failed to get product' });
  }
};

/**
 * Update product
 */
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { name, description, quantity, status } = req.body;

    // Check if product exists and user owns it
    const existing = await db.query(
      'SELECT * FROM products WHERE id = $1 AND current_owner_id = $2',
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
      return;
    }

    const result = await db.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           quantity = COALESCE($3, quantity),
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, quantity, status, id]
    );

    logger.info('Product updated', { productId: id, userId: req.user.id });

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    logger.error('Update product error', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM products WHERE id = $1 AND current_owner_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
      return;
    }

    logger.info('Product deleted', { productId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    logger.error('Delete product error', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
