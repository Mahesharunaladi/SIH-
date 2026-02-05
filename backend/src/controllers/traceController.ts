import { Response } from 'express';
import { db } from '../db';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

/**
 * Get complete trace data for a product
 */
export const getProductTrace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    // Get product details
    const productResult = await db.query(
      `SELECT p.*, u.name as owner_name, u.organization as owner_org, u.email as owner_email
       FROM products p
       LEFT JOIN profiles u ON p.current_owner_id = u.id
       WHERE p.id = $1`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const product = productResult.rows[0];

    // Get all supply chain events
    const eventsResult = await db.query(
      `SELECT e.*, p.name as performer_name, p.organization as performer_org,
              bt.transaction_hash, bt.block_number, bt.block_timestamp, bt.network
       FROM supply_chain_events e
       LEFT JOIN profiles p ON e.performed_by = p.id
       LEFT JOIN blockchain_transactions bt ON e.id = bt.event_id
       WHERE e.product_id = $1
       ORDER BY e.timestamp ASC`,
      [productId]
    );

    // Get certificates
    const certificatesResult = await db.query(
      'SELECT * FROM certificates WHERE product_id = $1 ORDER BY issue_date DESC',
      [productId]
    );

    // Get unique participants
    const participantsResult = await db.query(
      `SELECT DISTINCT p.id, p.name, p.role, p.organization
       FROM profiles p
       INNER JOIN supply_chain_events e ON p.id = e.performed_by
       WHERE e.product_id = $1`,
      [productId]
    );

    // Create scan event if consumer is viewing
    if (req.user?.role === 'consumer') {
      try {
        await db.query(
          `INSERT INTO supply_chain_events (
            product_id, event_type, performed_by, description, data_hash
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            productId,
            'SCAN',
            req.user.id,
            'Consumer scanned product',
            'scan-' + Date.now(),
          ]
        );
      } catch (error) {
        // Non-critical error, log but don't fail
        logger.warn('Failed to create scan event', error);
      }
    }

    const traceData = {
      product: {
        id: product.id,
        name: product.name,
        scientificName: product.scientific_name,
        description: product.description,
        category: product.category,
        quantity: parseFloat(product.quantity),
        unit: product.unit,
        status: product.status,
        batchNumber: product.batch_number,
        harvestDate: product.harvest_date,
        qrCode: product.qr_code,
        imageUrl: product.image_url,
        origin: product.origin_latitude && product.origin_longitude ? {
          latitude: parseFloat(product.origin_latitude),
          longitude: parseFloat(product.origin_longitude),
          accuracy: product.origin_accuracy ? parseFloat(product.origin_accuracy) : undefined,
        } : null,
        currentOwner: {
          name: product.owner_name,
          organization: product.owner_org,
          email: product.owner_email,
        },
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      events: eventsResult.rows.map((event: any) => ({
        id: event.id,
        eventType: event.event_type,
        timestamp: event.timestamp,
        description: event.description,
        performer: {
          name: event.performer_name,
          organization: event.performer_org,
        },
        location: event.location_latitude && event.location_longitude ? {
          latitude: parseFloat(event.location_latitude),
          longitude: parseFloat(event.location_longitude),
          accuracy: event.location_accuracy ? parseFloat(event.location_accuracy) : undefined,
        } : null,
        metadata: event.metadata,
        dataHash: event.data_hash,
        verified: event.verified,
        blockchain: event.transaction_hash ? {
          transactionHash: event.transaction_hash,
          blockNumber: event.block_number,
          blockTimestamp: event.block_timestamp,
          network: event.network,
        } : null,
      })),
      certificates: certificatesResult.rows.map((cert: any) => ({
        id: cert.id,
        type: cert.certificate_type,
        issuer: cert.issuer,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date,
        documentHash: cert.document_hash,
        documentUrl: cert.document_url,
        verified: cert.verified,
      })),
      participants: participantsResult.rows,
      summary: {
        totalEvents: eventsResult.rows.length,
        verifiedEvents: eventsResult.rows.filter((e: any) => e.verified).length,
        blockchainAnchored: eventsResult.rows.filter((e: any) => e.transaction_hash).length,
        participantsCount: participantsResult.rows.length,
        certificatesCount: certificatesResult.rows.length,
      },
    };

    logger.info('Product trace retrieved', {
      productId,
      eventsCount: traceData.events.length,
    });

    res.json({
      success: true,
      data: traceData,
    });
  } catch (error: any) {
    logger.error('Get product trace error', error);
    res.status(500).json({ success: false, error: 'Failed to get product trace' });
  }
};

/**
 * Get trace by QR code scan
 */
export const getTraceByQR = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrCode } = req.params;

    // Extract product ID from QR code (format: /trace?pid=<uuid>)
    const matches = qrCode.match(/pid=([a-f0-9-]+)/i);
    if (!matches) {
      res.status(400).json({ success: false, error: 'Invalid QR code format' });
      return;
    }

    const productId = matches[1];

    // Reuse the getProductTrace logic
    req.params.productId = productId;
    return getProductTrace(req, res);
  } catch (error: any) {
    logger.error('Get trace by QR error', error);
    res.status(500).json({ success: false, error: 'Failed to get trace' });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const role = req.user.role;

    // Products stats
    const productsResult = await db.query(
      'SELECT COUNT(*), status FROM products WHERE current_owner_id = $1 GROUP BY status',
      [userId]
    );

    // Events stats
    const eventsResult = await db.query(
      'SELECT COUNT(*), event_type FROM supply_chain_events WHERE performed_by = $1 GROUP BY event_type',
      [userId]
    );

    // Recent activity
    const recentActivity = await db.query(
      `SELECT e.*, p.name as product_name
       FROM supply_chain_events e
       LEFT JOIN products p ON e.product_id = p.id
       WHERE e.performed_by = $1
       ORDER BY e.timestamp DESC
       LIMIT 10`,
      [userId]
    );

    const stats = {
      products: {
        total: productsResult.rows.reduce((sum: any, row: any) => sum + parseInt(row.count), 0),
        byStatus: productsResult.rows.reduce((acc: any, row: any) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
      },
      events: {
        total: eventsResult.rows.reduce((sum: any, row: any) => sum + parseInt(row.count), 0),
        byType: eventsResult.rows.reduce((acc: any, row: any) => {
          acc[row.event_type] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
      },
      recentActivity: recentActivity.rows,
      role,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    logger.error('Get dashboard stats error', error);
    res.status(500).json({ success: false, error: 'Failed to get dashboard statistics' });
  }
};
