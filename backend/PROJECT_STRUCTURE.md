# HerbTrace Backend - Complete Structure

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts                 # Configuration management
│   │
│   ├── controllers/
│   │   ├── authController.ts        # Authentication logic
│   │   ├── productController.ts     # Product CRUD operations
│   │   ├── eventController.ts       # Supply chain events
│   │   └── traceController.ts       # Traceability & dashboard
│   │
│   ├── db/
│   │   ├── index.ts                 # Database connection pool
│   │   ├── schema.sql               # Database schema
│   │   └── migrate.ts               # Migration script
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication
│   │   ├── validation.ts            # Zod schema validation
│   │   └── errorHandler.ts          # Error handling
│   │
│   ├── routes/
│   │   ├── authRoutes.ts            # /auth endpoints
│   │   ├── productRoutes.ts         # /products endpoints
│   │   ├── eventRoutes.ts           # /events endpoints
│   │   └── traceRoutes.ts           # /trace endpoints
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   │
│   ├── utils/
│   │   ├── blockchain.ts            # Blockchain integration
│   │   ├── qr.ts                    # QR code generation
│   │   └── logger.ts                # Winston logger
│   │
│   ├── app.ts                       # Express app setup
│   └── index.ts                     # Entry point
│
├── logs/                             # Log files (gitignored)
├── uploads/                          # File uploads (gitignored)
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── API_DOCS.md                      # Complete API documentation
├── docker-compose.yml               # Docker Compose config
├── Dockerfile                       # Docker build config
├── package.json                     # Dependencies & scripts
├── QUICKSTART.md                    # Quick start guide
├── README.md                        # Main documentation
├── setup.sh                         # Setup automation script
└── tsconfig.json                    # TypeScript configuration
```

## 🔧 Core Components

### Configuration (`src/config/`)
- Centralized configuration from environment variables
- Type-safe config access
- Supports multiple environments (dev, prod)

### Controllers (`src/controllers/`)
- **authController**: User registration, login, profile management
- **productController**: Product CRUD with blockchain anchoring
- **eventController**: Supply chain event recording & verification
- **traceController**: Complete traceability data retrieval

### Database (`src/db/`)
- PostgreSQL connection pooling
- Schema with 7 tables:
  - `profiles`: User accounts
  - `products`: Product inventory
  - `supply_chain_events`: Event tracking
  - `blockchain_transactions`: Blockchain proofs
  - `certificates`: Quality certificates
  - `audit_logs`: System audit trail
- Automatic migrations

### Middleware (`src/middleware/`)
- **auth**: JWT token verification & role-based access
- **validation**: Zod schema validation for requests
- **errorHandler**: Global error handling & logging

### Routes (`src/routes/`)
- RESTful API endpoints
- Protected routes with authentication
- Public routes for traceability

### Types (`src/types/`)
- Shared TypeScript interfaces
- Enums for roles, statuses, event types
- API response types

### Utils (`src/utils/`)
- **blockchain**: Hash generation, blockchain anchoring (mock/real)
- **qr**: QR code generation in multiple formats
- **logger**: Structured logging with Winston

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt with salt
3. **Rate Limiting**: 100 requests per 15 minutes
4. **Helmet**: Security headers
5. **CORS**: Configurable cross-origin
6. **Input Validation**: Zod schemas
7. **SQL Injection Protection**: Parameterized queries
8. **Error Sanitization**: No sensitive data in errors

## 🗄️ Database Schema

### Tables Overview

1. **profiles**: User accounts with roles
   - Stores: email, password_hash, name, role, organization
   - Indexes: email

2. **products**: Product inventory
   - Stores: name, quantity, status, owner, geo-location, QR code
   - Indexes: status, owner, batch_number

3. **supply_chain_events**: Event tracking
   - Stores: event type, timestamp, performer, location, hash
   - Indexes: product_id, event_type, timestamp

4. **blockchain_transactions**: Blockchain proofs
   - Stores: tx_hash, block_number, event_id, hash
   - Indexes: event_id, tx_hash

5. **certificates**: Quality certificates
   - Stores: type, issuer, dates, document hash
   - Indexes: product_id

6. **audit_logs**: System audit trail
   - Stores: user, action, resource, metadata
   - Indexes: user_id, timestamp

### Relationships
```
profiles (1) ──── (N) products
products (1) ──── (N) supply_chain_events
supply_chain_events (1) ──── (1) blockchain_transactions
products (1) ──── (N) certificates
profiles (1) ──── (N) audit_logs
```

## 🔗 API Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get profile (protected)
- `PUT /profile` - Update profile (protected)

### Products (`/api/v1/products`)
- `POST /` - Create product (protected)
- `GET /` - List products (public)
- `GET /:id` - Get product (public)
- `PUT /:id` - Update product (protected)
- `DELETE /:id` - Delete product (protected)

### Events (`/api/v1/events`)
- `POST /` - Create event (protected)
- `GET /product/:productId` - Get product events (public)
- `GET /:id` - Get event (public)
- `GET /:id/verify` - Verify event (public)

### Trace (`/api/v1/trace`)
- `GET /product/:productId` - Get full trace (public)
- `GET /qr/:qrCode` - Get trace by QR (public)
- `GET /dashboard/stats` - Get dashboard stats (protected)

## 🚀 Deployment Options

### 1. Docker (Recommended)
```bash
docker-compose up -d
```
- Includes PostgreSQL
- Auto-restarts
- Health checks
- Volume persistence

### 2. Traditional VPS
```bash
npm install
npm run build
npm start
```
- Requires PostgreSQL setup
- Use PM2 for process management
- Set up reverse proxy (nginx)

### 3. Cloud Platforms
- **Heroku**: Add PostgreSQL addon
- **AWS**: Use ECS + RDS
- **Digital Ocean**: App Platform + Managed DB
- **Railway**: Auto-detect setup

## 🔄 Development Workflow

1. **Local Development**:
   ```bash
   npm run dev
   ```
   - Hot reload with tsx
   - Mock blockchain
   - Console logs

2. **Testing Changes**:
   - Use Postman/Insomnia
   - Check logs in `logs/`
   - Verify DB with psql

3. **Building for Production**:
   ```bash
   npm run build
   ```
   - Compiles TypeScript
   - Outputs to `dist/`

4. **Running Production**:
   ```bash
   npm start
   ```
   - Uses compiled JS
   - Production optimizations

## 📊 Monitoring & Logging

### Log Levels
- `error`: Errors that need attention
- `warn`: Warnings (non-critical)
- `info`: Important events
- `debug`: Detailed debugging

### Log Files
- `logs/combined.log`: All logs
- `logs/error.log`: Errors only

### What's Logged
- All HTTP requests
- Authentication attempts
- Database queries
- Blockchain transactions
- Errors with stack traces

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test","role":"farmer"}'
```

### Automated Testing (Future)
- Unit tests: Jest
- Integration tests: Supertest
- E2E tests: Cypress

## 🔮 Future Enhancements

1. **Real Blockchain Integration**
   - Deploy smart contracts
   - Connect to Polygon/Ethereum
   - Gas optimization

2. **Advanced Features**
   - File upload for certificates
   - Email notifications
   - SMS alerts
   - Export to PDF/CSV

3. **Analytics**
   - Supply chain analytics
   - Farmer insights
   - Consumer behavior

4. **Mobile App Support**
   - Push notifications
   - Mobile-optimized endpoints
   - Offline support

## 💻 Technology Choices

### Why Node.js + Express?
- Fast development
- JavaScript/TypeScript ecosystem
- Excellent async handling
- Wide library support

### Why PostgreSQL?
- ACID compliance
- JSON support (JSONB)
- Excellent performance
- Mature and stable

### Why TypeScript?
- Type safety
- Better IDE support
- Catch errors early
- Self-documenting code

### Why JWT?
- Stateless authentication
- Scalable
- Standard protocol
- Mobile-friendly

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow TypeScript best practices
4. Add tests if applicable
5. Update documentation
6. Submit pull request

## 📞 Support

For issues or questions:
- Check logs: `logs/`
- Review documentation
- GitHub Issues
- Email: [support contact]

---

**Built with ❤️ for Smart India Hackathon 2026**
