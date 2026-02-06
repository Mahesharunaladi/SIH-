import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { db } from './db';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import eventRoutes from './routes/eventRoutes';
import traceRoutes from './routes/traceRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS - Must be before other middleware
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 600, // 10 minutes
      })
    );

    // Handle preflight requests
    this.app.options('*', cors());

    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Request logging
    this.app.use((req: any, _res: any, next: any) => {
      logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
      next();
    });
  }

  private initializeRoutes(): void {
    const apiPrefix = config.apiPrefix;

    // Health check
    this.app.get('/health', (_req: any, res: any) => {
      res.json({
        success: true,
        message: 'HerbTrace API is running',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/products`, productRoutes);
    this.app.use(`${apiPrefix}/events`, eventRoutes);
    this.app.use(`${apiPrefix}/trace`, traceRoutes);

    // API documentation
    this.app.get(`${apiPrefix}`, (_req: any, res: any) => {
      res.json({
        success: true,
        message: 'HerbTrace API v1',
        endpoints: {
          auth: `${apiPrefix}/auth`,
          products: `${apiPrefix}/products`,
          events: `${apiPrefix}/events`,
          trace: `${apiPrefix}/trace`,
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await db.connect();

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`Server started on port ${config.port} in ${config.env} mode`);
        logger.info(`API available at http://localhost:${config.port}${config.apiPrefix}`);
      });
    } catch (error) {
      logger.error('Failed to start server', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await db.close();
      logger.info('Server stopped gracefully');
    } catch (error) {
      logger.error('Error stopping server', error);
    }
  }
}

export default App;
