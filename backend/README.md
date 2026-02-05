# HerbTrace Backend API

Complete backend implementation for the HerbTrace blockchain-based botanical traceability system.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Create, read, update, and delete products with geo-tagging
- **Blockchain Integration**: Anchor supply chain events to blockchain (mock or real Ethereum/Polygon)
- **Supply Chain Tracking**: Record and verify events throughout the supply chain
- **QR Code Generation**: Generate scannable QR codes for product traceability
- **RESTful API**: Clean, documented API endpoints
- **Database**: PostgreSQL with optimized schema and indexes
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston-based structured logging

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Blockchain**: Ethers.js (supports Ethereum, Polygon, etc.)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **QR Codes**: qrcode
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## Installation

1. **Clone the repository**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=herbtrace
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your_jwt_secret_here
   
   USE_MOCK_BLOCKCHAIN=true
   ```

4. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb herbtrace
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE herbtrace;
   ```

5. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123",
  "name": "John Farmer",
  "role": "farmer",
  "organization": "Green Farms Ltd"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

### Products

#### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ashwagandha Root",
  "scientificName": "Withania somnifera",
  "description": "Organic Ashwagandha roots",
  "category": "Medicinal Herb",
  "quantity": 100,
  "unit": "kg",
  "harvestDate": "2026-02-05T10:00:00Z",
  "batchNumber": "ASH-2026-001",
  "originLatitude": 28.6139,
  "originLongitude": 77.2090,
  "originAccuracy": 10
}
```

#### Get All Products
```http
GET /products?page=1&limit=20&status=HARVESTED&ownerId=<uuid>
```

#### Get Product by ID
```http
GET /products/:id
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROCESSING",
  "quantity": 95
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

## User Roles

- `farmer`: Can create and manage harvested products
- `manufacturer`: Can create batches and process products
- `processor`: Can process and transform products
- `distributor`: Can manage distribution
- `retailer`: Can manage retail inventory
- `consumer`: Can view and verify products
- `admin`: Full access to all resources

## Product Status Flow

```
HARVESTED → IN_PROCESSING → PROCESSED → PACKAGED → IN_TRANSIT → IN_WAREHOUSE → AVAILABLE → SOLD
                                                                                          ↓
                                                                                     RECALLED
```

## Event Types

- `HARVEST`: Initial harvest event with geo-location
- `PROCESSING`: Processing or transformation
- `QUALITY_TEST`: Quality testing and certification
- `PACKAGING`: Packaging event
- `SHIPMENT`: Shipping/logistics event
- `TRANSFER`: Ownership transfer
- `LISTING`: Product listing for sale
- `SCAN`: Consumer scan event
- `VERIFICATION`: Verification event

## Blockchain Integration

### Mock Mode (Development)
Set `USE_MOCK_BLOCKCHAIN=true` in `.env` for development without real blockchain costs.

### Real Blockchain (Production)
1. Set up Ethereum/Polygon node:
   ```env
   USE_MOCK_BLOCKCHAIN=false
   BLOCKCHAIN_NETWORK=sepolia
   BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   BLOCKCHAIN_PRIVATE_KEY=your_private_key
   CONTRACT_ADDRESS=0x...
   ```

2. Deploy smart contract (optional - using existing contract):
   ```solidity
   // Simple traceability contract
   function recordEvent(string memory dataHash) public returns (uint256)
   function verifyEvent(uint256 eventId, string memory dataHash) public view returns (bool)
   ```

## Database Schema

### Tables
- **profiles**: User accounts with roles
- **products**: Product inventory with geo-tagging
- **supply_chain_events**: Supply chain event tracking
- **blockchain_transactions**: Blockchain proof records
- **certificates**: Quality certificates and compliance docs
- **audit_logs**: System audit trail

### Key Features
- UUID primary keys
- Automatic timestamps
- Indexes for performance
- Foreign key constraints
- JSONB for flexible metadata

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent abuse
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries

## Logging

Logs are stored in `./logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

Console logs in development mode.

## Error Handling

Standardized error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

## Testing

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration
│   ├── controllers/      # Route controllers
│   ├── db/              # Database setup & migrations
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities (blockchain, QR, logger)
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── logs/                # Log files
├── uploads/             # File uploads
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database
- Set up real blockchain connection
- Configure CORS for production domain

## API Documentation

Visit `/api/v1` for API overview.

For detailed API documentation, import the Postman collection (coming soon).

## Support

For issues or questions:
1. Check the logs in `./logs/`
2. Review environment configuration
3. Verify database connection
4. Check blockchain configuration (if using real blockchain)

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

Built for Smart India Hackathon 2026 - HerbTrace Project
