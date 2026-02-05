# HerbTrace Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                            │
│  (React Frontend, Mobile App, Postman, cURL)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js Server (Port 5000)                            │  │
│  │  - CORS, Helmet, Rate Limiting                           │  │
│  │  - JSON Body Parser                                      │  │
│  │  - Compression                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│   MIDDLEWARE LAYER      │  │   ROUTES LAYER           │
│  ┌──────────────────┐  │  │  /api/v1/auth           │
│  │ Authentication   │  │  │  /api/v1/products       │
│  │ - JWT Verify     │  │  │  /api/v1/events         │
│  │ - Role Check     │  │  │  /api/v1/trace          │
│  └──────────────────┘  │  └──────────────────────────┘
│  ┌──────────────────┐  │
│  │ Validation       │  │
│  │ - Zod Schemas    │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Error Handler    │  │
│  └──────────────────┘  │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                              │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ Auth          │ │ Product      │ │ Event        │           │
│  │ Controller    │ │ Controller   │ │ Controller   │           │
│  │ - Register    │ │ - Create     │ │ - Record     │           │
│  │ - Login       │ │ - Update     │ │ - Verify     │           │
│  │ - Profile     │ │ - List       │ │ - Track      │           │
│  └───────────────┘ └──────────────┘ └──────────────┘           │
│                    ┌──────────────┐                             │
│                    │ Trace        │                             │
│                    │ Controller   │                             │
│                    │ - Full Trace │                             │
│                    │ - QR Scan    │                             │
│                    │ - Analytics  │                             │
│                    └──────────────┘                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│   UTILITY LAYER         │  │   DATABASE LAYER         │
│  ┌──────────────────┐  │  │  ┌────────────────────┐ │
│  │ Blockchain       │  │  │  │ PostgreSQL Pool    │ │
│  │ - Hash Events    │  │  │  │ - Connection Pool  │ │
│  │ - Anchor to Chain│  │  │  │ - Query Builder    │ │
│  │ - Verify Proofs  │  │  │  └────────────────────┘ │
│  └──────────────────┘  │  │                          │
│  ┌──────────────────┐  │  │  Tables:                 │
│  │ QR Generator     │  │  │  - profiles             │
│  │ - Create QR      │  │  │  - products             │
│  │ - PNG/SVG/Buffer │  │  │  - supply_chain_events  │
│  └──────────────────┘  │  │  - blockchain_txs       │
│  ┌──────────────────┐  │  │  - certificates         │
│  │ Logger           │  │  │  - audit_logs           │
│  │ - Winston        │  │  └──────────────────────────┘
│  │ - File Logging   │  │
│  └──────────────────┘  │
└─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES LAYER                         │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Blockchain       │  │ File System      │                    │
│  │ - Ethereum       │  │ - Logs           │                    │
│  │ - Polygon        │  │ - Uploads        │                    │
│  │ - Mock (Dev)     │  │ - QR Codes       │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Example: Create Product with Blockchain Anchoring

```
┌─────────┐
│ Client  │
└────┬────┘
     │ POST /api/v1/products
     │ Authorization: Bearer <token>
     │ { name, quantity, originLat, originLng, ... }
     ▼
┌─────────────────┐
│ Express Server  │
└────┬────────────┘
     │ 1. CORS Check
     │ 2. Rate Limit Check
     │ 3. Parse JSON Body
     ▼
┌──────────────────┐
│ Auth Middleware  │
│ - Verify JWT     │
│ - Check Role     │
└────┬─────────────┘
     │ User: { id, role: "farmer" }
     ▼
┌────────────────────┐
│ Validation         │
│ - Zod Schema       │
└────┬───────────────┘
     │ Validated Data
     ▼
┌──────────────────────────────────────┐
│ Product Controller                   │
│ 1. Start DB Transaction              │
│ 2. Generate Product ID (UUID)        │
│ 3. Generate QR Code                  │
│    ├─> QR Util                       │
│    └─> Returns: data:image/png;...   │
│ 4. Insert Product to DB              │
│    └─> products table                │
│ 5. Create Harvest Event              │
│    ├─> Hash Event Data (SHA-256)    │
│    │   └─> Blockchain Util           │
│    ├─> Insert to supply_chain_events │
│    └─> Anchor to Blockchain          │
│        ├─> Mock: Generate TX Hash    │
│        └─> Real: Call Smart Contract │
│ 6. Store Blockchain Proof            │
│    └─> blockchain_transactions       │
│ 7. Commit Transaction                │
└────┬─────────────────────────────────┘
     │ Success Response
     ▼
┌─────────┐
│ Client  │
│ Receives:│
│ - Product Data                       │
│ - QR Code                            │
│ - Blockchain Proof                   │
│   - TX Hash: 0x...                   │
│   - Block Number: 12345              │
└──────────┘
```

## Database Schema Relationships

```
┌────────────────┐
│   profiles     │
│ ──────────────│
│ PK: id        │◄─────┐
│    email      │      │
│    role       │      │
│    ...        │      │
└────────────────┘      │
                        │ FK: current_owner_id
                        │
                ┌───────┴──────────┐
                │                  │
         ┌──────┴────────┐  ┌──────┴────────────┐
         │   products    │  │ supply_chain_     │
         │ ──────────────│  │   events          │
         │ PK: id       │◄──┤ ──────────────    │
         │    name       │  │ PK: id            │
         │    status     │  │ FK: product_id    │
         │    qr_code    │  │ FK: performed_by  │
         │    origin_lat │  │    event_type     │
         │    origin_lng │  │    data_hash      │
         │    ...        │  │    ...            │
         └───────────────┘  └────────┬──────────┘
                │                    │
                │                    │ FK: event_id
                │                    ▼
                │          ┌──────────────────────┐
                │          │ blockchain_          │
                │          │   transactions       │
                │          │ ────────────────     │
                │          │ PK: id               │
                │          │ FK: event_id         │
                │          │    transaction_hash  │
                │          │    block_number      │
                │          │    ...               │
                │          └──────────────────────┘
                │
                │ FK: product_id
                ▼
         ┌──────────────┐
         │ certificates │
         │ ─────────────│
         │ PK: id       │
         │ FK: product_id│
         │    type      │
         │    issuer    │
         │    ...       │
         └──────────────┘
```

## Authentication Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │ POST /auth/register
     │ { email, password, name, role }
     ▼
┌──────────────────┐
│ Auth Controller  │
│ 1. Validate Data │
│ 2. Check Existing│
│ 3. Hash Password │────► bcrypt (10 rounds)
│ 4. Insert User   │────► profiles table
│ 5. Generate JWT  │────► jwt.sign({ id, email, role })
└────┬─────────────┘
     │ { user, token }
     ▼
┌─────────┐
│ Client  │ Stores token
└─────────┘

     │ Later: POST /products
     │ Authorization: Bearer <token>
     ▼
┌──────────────────┐
│ Auth Middleware  │
│ 1. Extract Token │
│ 2. Verify JWT    │────► jwt.verify(token, secret)
│ 3. Decode Payload│────► { id, email, role }
│ 4. Attach to req │────► req.user = { ... }
└────┬─────────────┘
     │ Authenticated
     ▼
┌──────────────────┐
│ Protected Route  │
│ Access Granted   │
└──────────────────┘
```

## Blockchain Integration Flow

```
┌────────────────────┐
│ Supply Chain Event │
│ { productId,       │
│   eventType,       │
│   timestamp,       │
│   location,        │
│   metadata }       │
└────┬───────────────┘
     │
     ▼
┌────────────────────────────┐
│ Hash Event (SHA-256)       │
│ JSON.stringify(event)      │
│ ─────► Hash String         │
└────┬───────────────────────┘
     │ dataHash: "abc123..."
     ▼
┌────────────────────────────┐
│ Anchor to Blockchain       │
│                            │
│ IF Mock Mode:              │
│   - Generate Random TX Hash│
│   - Simulate Block Number  │
│                            │
│ IF Real Mode:              │
│   - Connect to RPC         │
│   - Call Smart Contract    │
│   - contract.recordEvent() │
│   - Wait for Confirmation  │
└────┬───────────────────────┘
     │ ChainProof:
     │ { txHash, blockNum, timestamp }
     ▼
┌────────────────────────────┐
│ Store in Database          │
│ - supply_chain_events      │
│   (data_hash, tx_id)       │
│ - blockchain_transactions  │
│   (tx_hash, block_num)     │
└────────────────────────────┘
```

## Request/Response Cycle

```
HTTP Request
     │
     ├─► Express Middleware Stack
     │   ├─► helmet() - Security Headers
     │   ├─► cors() - CORS Check
     │   ├─► express.json() - Parse Body
     │   ├─► compression() - Compress Response
     │   ├─► rateLimit() - Rate Limiting
     │   └─► logger() - Log Request
     │
     ├─► Route Matching
     │   └─► /api/v1/products/:id
     │
     ├─► Route Middleware
     │   ├─► authenticate() - Verify JWT
     │   ├─► authorize(roles) - Check Role
     │   └─► validateParams() - Validate Input
     │
     ├─► Controller
     │   ├─► Business Logic
     │   ├─► Database Queries
     │   ├─► Blockchain Operations
     │   └─► Response Formation
     │
     └─► Error Handler (if error)
         └─► Formatted Error Response

HTTP Response
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLOUD PLATFORM                      │
│  (AWS / Digital Ocean / Heroku / Railway)               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Load Balancer (Optional)              │ │
│  └───────────────────┬────────────────────────────────┘ │
│                      │                                   │
│  ┌───────────────────┴────────────────────────────┐    │
│  │                                                  │    │
│  │  ┌──────────────┐        ┌──────────────┐     │    │
│  │  │   Backend    │        │   Backend    │     │    │
│  │  │  Instance 1  │        │  Instance 2  │     │    │
│  │  │  (Docker)    │        │  (Docker)    │     │    │
│  │  └──────┬───────┘        └──────┬───────┘     │    │
│  │         │                        │              │    │
│  │         └────────┬───────────────┘              │    │
│  │                  │                              │    │
│  └──────────────────┼──────────────────────────────┘    │
│                     │                                    │
│  ┌──────────────────┴─────────────────────────────┐    │
│  │         PostgreSQL Database (Managed)          │    │
│  │         - Automatic Backups                    │    │
│  │         - Read Replicas                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         External Services                         │  │
│  │  - Ethereum/Polygon Node (Alchemy/Infura)       │  │
│  │  - File Storage (S3/Cloud Storage)              │  │
│  │  - Email Service (SendGrid/SES)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Layer 7: Application            │
│  - Input Validation (Zod)              │
│  - SQL Injection Prevention            │
│  - XSS Protection                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Layer 6: Authentication         │
│  - JWT Token Verification              │
│  - Password Hashing (bcrypt)           │
│  - Role-Based Access Control           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Layer 5: API Security           │
│  - Rate Limiting                        │
│  - CORS Configuration                   │
│  - Helmet Headers                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Layer 4: Network                │
│  - HTTPS/TLS Encryption                │
│  - Firewall Rules                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Layer 3: Database               │
│  - Parameterized Queries               │
│  - Connection Pooling                   │
│  - Access Control                       │
└─────────────────────────────────────────┘
```

---

This architecture ensures **scalability**, **security**, and **maintainability** for the HerbTrace system.
