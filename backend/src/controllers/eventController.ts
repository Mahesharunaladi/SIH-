import { Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { logger } from '../utils/logger';
import { blockchainService } from '../utils/blockchain';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
export const createEventSchema = z.object({
  productId: z.string().uuid(),
  eventType: z.enum(['HARVEST', 'PROCESSING', 'QUALITY_TEST', 'PACKAGING', 'SHIPMENT', 'TRANSFER', 'LISTING', 'SCAN', 'VERIFICATION']),
  description: z.string().optional(),
  locationLatitude: z.number().optional(),
  locationLongitude: z.number().optional(),
  locationAccuracy: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Create supply chain event
 */
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await db.getClient();

  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    await client.query('BEGIN');

    const {
      productId,
      eventType,
      description,
      locationLatitude,
      locationLongitude,
      locationAccuracy,
      metadata,
    } = req.body;

    // Verify product exists
    const productCheck = await client.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (productCheck.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Prepare event data for hashing
    const eventData = {
      productId,
      eventType,
      performedBy: req.user.id,
      timestamp: new Date().toISOString(),
      location: locationLatitude && locationLongitude ? {
        latitude: locationLatitude,
        longitude: locationLongitude,
        accuracy: locationAccuracy,
      } : null,
      metadata,
    };

    // Hash the event data
    const dataHash = blockchainService.hashEvent(eventData);

    // Insert event
    const eventResult = await client.query(
      `INSERT INTO supply_chain_events (
        product_id, event_type, performed_by, location_latitude,
        location_longitude, location_accuracy, description, metadata, data_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        productId,
        eventType,
        req.user.id,
        locationLatitude,
        locationLongitude,
        locationAccuracy,
        description,
        metadata ? JSON.stringify(metadata) : null,
        dataHash,
      ]
    );

    const event = eventResult.rows[0];

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
        event.id,
        dataHash,
        chainProof.gasUsed,
        'confirmed',
      ]
    );

    // Update event with blockchain tx id
    await client.query(
      'UPDATE supply_chain_events SET blockchain_tx_id = $1, verified = true WHERE id = $2',
      [event.id, event.id]
    );

    await client.query('COMMIT');

    logger.info('Supply chain event created', {
      eventId: event.id,
      productId,
      eventType,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: {
        event: {
          ...event,
          metadata: metadata,
        },
        blockchainProof: chainProof,
      },
      message: 'Event recorded and anchored to blockchain',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    logger.error('Create event error', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  } finally {
    client.release();
  }
};

/**
 * Get events for a product
 */
export const getProductEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const result = await db.query(
      `SELECT e.*, p.name as performer_name, p.organization as performer_org,
              bt.transaction_hash, bt.block_number, bt.block_timestamp
       FROM supply_chain_events e
       LEFT JOIN profiles p ON e.performed_by = p.id
       LEFT JOIN blockchain_transactions bt ON e.id = bt.event_id
       WHERE e.product_id = $1
       ORDER BY e.timestamp DESC`,
      [productId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    logger.error('Get product events error', error);
    res.status(500).json({ success: false, error: 'Failed to get events' });
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT e.*, p.name as performer_name, p.organization as performer_org,
              bt.transaction_hash, bt.block_number, bt.block_timestamp
       FROM supply_chain_events e
       LEFT JOIN profiles p ON e.performed_by = p.id
       LEFT JOIN blockchain_transactions bt ON e.id = bt.event_id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Get event error', error);
    res.status(500).json({ success: false, error: 'Failed to get event' });
  }
};

/**
 * Verify event integrity
 */
export const verifyEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT e.*, bt.transaction_hash
       FROM supply_chain_events e
       LEFT JOIN blockchain_transactions bt ON e.id = bt.event_id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    const event = result.rows[0];

    // Reconstruct event data and hash
    const eventData = {
      productId: event.product_id,
      eventType: event.event_type,
      performedBy: event.performed_by,
      timestamp: event.timestamp,
      location: event.location_latitude && event.location_longitude ? {
        latitude: parseFloat(event.location_latitude),
        longitude: parseFloat(event.location_longitude),
        accuracy: event.location_accuracy ? parseFloat(event.location_accuracy) : undefined,
      } : null,
      metadata: event.metadata,
    };

    const computedHash = blockchainService.hashEvent(eventData);
    const isValid = computedHash === event.data_hash;

    logger.info('Event verification', {
      eventId: id,
      isValid,
      storedHash: event.data_hash,
      computedHash,
    });

    res.json({
      success: true,
      data: {
        eventId: id,
        isValid,
        storedHash: event.data_hash,
        computedHash,
        blockchainTxHash: event.transaction_hash,
        verified: event.verified,
      },
      message: isValid ? 'Event integrity verified' : 'Event integrity check failed',
    });
  } catch (error: any) {
    logger.error('Verify event error', error);
    res.status(500).json({ success: false, error: 'Failed to verify event' });
  }
};
