# HerbTrace API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "SecurePassword123!",
  "name": "John Farmer",
  "role": "farmer",
  "organization": "Green Farms Ltd",
  "phone": "+1234567890",
  "address": "123 Farm Road, Village"
}
```

**Roles:** `farmer`, `manufacturer`, `processor`, `distributor`, `retailer`, `consumer`, `admin`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "farmer@example.com",
      "name": "John Farmer",
      "role": "farmer",
      "organization": "Green Farms Ltd"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "farmer@example.com",
      "name": "John Farmer",
      "role": "farmer",
      "verified": true
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### Get Profile

**GET** `/auth/profile`

Get current user's profile. Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "farmer@example.com",
    "name": "John Farmer",
    "role": "farmer",
    "organization": "Green Farms Ltd",
    "phone": "+1234567890",
    "verified": true,
    "created_at": "2026-02-05T10:00:00Z"
  }
}
```

### Update Profile

**PUT** `/auth/profile`

Update current user's profile. Requires authentication.

**Request Body:**
```json
{
  "name": "John Updated",
  "organization": "New Organization",
  "phone": "+9876543210",
  "address": "New Address"
}
```

---

## Product Endpoints

### Create Product

**POST** `/products`

Create a new product. Requires authentication (farmer/manufacturer/admin).

**Request Body:**
```json
{
  "name": "Ashwagandha Root",
  "scientificName": "Withania somnifera",
  "description": "Organic Ashwagandha roots from certified farms",
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

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Ashwagandha Root",
      "status": "HARVESTED",
      "qr_code": "data:image/png;base64,...",
      ...
    },
    "blockchainProof": {
      "transactionHash": "0x...",
      "blockNumber": 12345,
      "blockTimestamp": 1707134400
    }
  },
  "message": "Product created and anchored to blockchain"
}
```

### Get All Products

**GET** `/products`

Get all products with pagination and filtering. Public endpoint.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `ownerId` (optional): Filter by owner

**Example:** `/products?page=1&limit=10&status=HARVESTED`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ashwagandha Root",
      "quantity": 100,
      "unit": "kg",
      "status": "HARVESTED",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Product by ID

**GET** `/products/:id`

Get a specific product by ID. Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ashwagandha Root",
    "scientific_name": "Withania somnifera",
    "quantity": 100,
    "unit": "kg",
    "status": "HARVESTED",
    "batch_number": "ASH-2026-001",
    "harvest_date": "2026-02-05T10:00:00Z",
    "qr_code": "data:image/png;base64,...",
    ...
  }
}
```

### Update Product

**PUT** `/products/:id`

Update a product. Requires authentication and ownership.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "quantity": 95,
  "status": "IN_PROCESSING"
}
```

**Product Statuses:**
- `HARVESTED`
- `IN_PROCESSING`
- `PROCESSED`
- `PACKAGED`
- `IN_TRANSIT`
- `IN_WAREHOUSE`
- `AVAILABLE`
- `SOLD`
- `RECALLED`

### Delete Product

**DELETE** `/products/:id`

Delete a product. Requires authentication and ownership.

---

## Event Endpoints

### Create Supply Chain Event

**POST** `/events`

Record a new supply chain event. Requires authentication.

**Request Body:**
```json
{
  "productId": "uuid",
  "eventType": "PROCESSING",
  "description": "Cleaned and dried herbs",
  "locationLatitude": 28.7041,
  "locationLongitude": 77.1025,
  "locationAccuracy": 5,
  "metadata": {
    "processType": "drying",
    "temperature": "45C",
    "duration": "24 hours"
  }
}
```

**Event Types:**
- `HARVEST`: Initial harvest
- `PROCESSING`: Processing/transformation
- `QUALITY_TEST`: Quality testing
- `PACKAGING`: Packaging
- `SHIPMENT`: Shipping
- `TRANSFER`: Ownership transfer
- `LISTING`: Product listing
- `SCAN`: Consumer scan
- `VERIFICATION`: Verification check

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "product_id": "uuid",
      "event_type": "PROCESSING",
      "timestamp": "2026-02-05T12:00:00Z",
      "data_hash": "abc123...",
      ...
    },
    "blockchainProof": {
      "transactionHash": "0x...",
      "blockNumber": 12346,
      "blockTimestamp": 1707141600
    }
  },
  "message": "Event recorded and anchored to blockchain"
}
```

### Get Events for Product

**GET** `/events/product/:productId`

Get all events for a specific product. Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event_type": "HARVEST",
      "timestamp": "2026-02-05T10:00:00Z",
      "performer_name": "John Farmer",
      "performer_org": "Green Farms Ltd",
      "location_latitude": 28.6139,
      "location_longitude": 77.2090,
      "transaction_hash": "0x...",
      "block_number": 12345,
      ...
    }
  ]
}
```

### Get Event by ID

**GET** `/events/:id`

Get a specific event by ID. Public endpoint.

### Verify Event

**GET** `/events/:id/verify`

Verify the integrity of an event by checking its hash. Public endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "uuid",
    "isValid": true,
    "storedHash": "abc123...",
    "computedHash": "abc123...",
    "blockchainTxHash": "0x...",
    "verified": true
  },
  "message": "Event integrity verified"
}
```

---

## Traceability Endpoints

### Get Product Trace

**GET** `/trace/product/:productId`

Get complete traceability data for a product. Public endpoint with optional auth.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Ashwagandha Root",
      "status": "AVAILABLE",
      "origin": {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "accuracy": 10
      },
      ...
    },
    "events": [
      {
        "id": "uuid",
        "eventType": "HARVEST",
        "timestamp": "2026-02-05T10:00:00Z",
        "performer": {
          "name": "John Farmer",
          "organization": "Green Farms Ltd"
        },
        "location": { ... },
        "blockchain": {
          "transactionHash": "0x...",
          "blockNumber": 12345
        }
      }
    ],
    "certificates": [
      {
        "type": "Organic Certification",
        "issuer": "Organic India",
        "issueDate": "2026-01-01",
        "verified": true
      }
    ],
    "participants": [
      {
        "id": "uuid",
        "name": "John Farmer",
        "role": "farmer",
        "organization": "Green Farms Ltd"
      }
    ],
    "summary": {
      "totalEvents": 5,
      "verifiedEvents": 5,
      "blockchainAnchored": 5,
      "participantsCount": 3,
      "certificatesCount": 1
    }
  }
}
```

### Get Trace by QR Code

**GET** `/trace/qr/:qrCode`

Get trace data by scanning QR code. Public endpoint.

### Get Dashboard Statistics

**GET** `/trace/dashboard/stats`

Get statistics for current user's dashboard. Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "products": {
      "total": 25,
      "byStatus": {
        "HARVESTED": 10,
        "IN_PROCESSING": 8,
        "AVAILABLE": 7
      }
    },
    "events": {
      "total": 125,
      "byType": {
        "HARVEST": 25,
        "PROCESSING": 40,
        "PACKAGING": 30,
        "SHIPMENT": 30
      }
    },
    "recentActivity": [...],
    "role": "farmer"
  }
}
```

---

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "farmer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Product (with auth)
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Ashwagandha Root",
    "quantity": 100,
    "unit": "kg",
    "originLatitude": 28.6139,
    "originLongitude": 77.2090
  }'
```

### Get Product Trace
```bash
curl http://localhost:5000/api/v1/trace/product/PRODUCT_UUID
```

---

## Postman Collection

Import this base URL into Postman:
```
http://localhost:5000/api/v1
```

Create environment variables:
- `base_url`: `http://localhost:5000/api/v1`
- `token`: Your JWT token from login

---

For more information, visit the [GitHub repository](https://github.com/Mahesharunaladi/SIH-).
