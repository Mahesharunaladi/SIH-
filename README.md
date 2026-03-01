# 🌿 HerbTrace - Blockchain-based Botanical Traceability System

A comprehensive supply chain traceability platform for herbal and botanical products, featuring blockchain integration, role-based access control, and email verification.

---

## 🚀 Backend Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Mahesharunaladi/SIH-.git
cd SIH-
```

### 2. Database Setup

#### Install PostgreSQL
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE herbtrace;
CREATE USER postgres WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE herbtrace TO postgres;
\q
```

#### Run Schema Migration
```bash
cd backend
PGPASSWORD=root psql -U postgres -d herbtrace -f src/db/schema.sql
```

#### Run Email Verification Migration
```bash
PGPASSWORD=root psql -U postgres -d herbtrace -f src/db/migrations/add_email_verification.sql
```

### 3. Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually
```

### 4. Configure Environment Variables

Edit `backend/.env` file with your configuration:

```env
# Environment
NODE_ENV=development
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=herbtrace
DB_USER=postgres
DB_PASSWORD=root

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Blockchain Configuration (Optional - uses mock by default)
BLOCKCHAIN_NETWORK=sepolia
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
USE_MOCK_BLOCKCHAIN=true

# API Configuration
API_PREFIX=/api/v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@herbtrace.com
EMAIL_FROM_NAME=HerbTrace

# Frontend URL
FRONTEND_URL=http://localhost:5175

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

### 5. Email Configuration (Gmail)

To enable email verification:

1. **Enable 2-Factor Authentication:**
   - Visit: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" (name it "HerbTrace")
   - Copy the 16-character password

3. **Update .env:**
   ```env
   EMAIL_USER=your_actual_email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  # Your 16-char app password (no spaces)
   ```

### 6. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build
npm run build
npm start
```

The backend server will start on: **http://localhost:5001**

API is available at: **http://localhost:5001/api/v1**

---

## 📋 Backend API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "farmer",
  "organization": "Green Farms",
  "phone": "+1234567890",
  "address": "123 Farm Road"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "farmer",
      "emailVerified": false
    },
    "token": "jwt_token_here"
  },
  "message": "Registration successful! Please check your email to verify your account."
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Resend Verification Email
```http
POST /api/v1/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "organization": "New Organization",
  "phone": "+9876543210",
  "address": "New Address"
}
```

### Product Endpoints

#### Create Product
```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Organic Turmeric",
  "description": "Premium quality turmeric",
  "category": "herbs",
  "botanicalName": "Curcuma longa",
  "origin": "Kerala, India",
  "harvestDate": "2024-01-15",
  "certifications": ["organic", "fair-trade"]
}
```

#### Get All Products
```http
GET /api/v1/products
Authorization: Bearer <token>
```

#### Get Product by ID
```http
GET /api/v1/products/:id
Authorization: Bearer <token>
```

#### Update Product
```http
PUT /api/v1/products/:id
Authorization: Bearer <token>
```

#### Delete Product
```http
DELETE /api/v1/products/:id
Authorization: Bearer <token>
```

### Supply Chain Event Endpoints

#### Add Event
```http
POST /api/v1/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_uuid",
  "eventType": "harvest",
  "location": "Farm Location",
  "description": "Harvested organically",
  "metadata": {
    "quantity": "100kg",
    "quality": "Grade A"
  }
}
```

#### Get Product Events
```http
GET /api/v1/events/product/:productId
Authorization: Bearer <token>
```

### Trace Endpoints

#### Get Product Trace
```http
GET /api/v1/trace/:productId
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Tables

#### profiles
- `id` - UUID (Primary Key)
- `email` - VARCHAR(255) UNIQUE
- `password_hash` - VARCHAR(255)
- `name` - VARCHAR(255)
- `role` - VARCHAR(50)
- `organization` - VARCHAR(255)
- `phone` - VARCHAR(50)
- `address` - TEXT
- `verified` - BOOLEAN
- `email_verified` - BOOLEAN
- `email_verification_token` - TEXT
- `email_verification_expires` - TIMESTAMP
- `verification_attempts` - INTEGER
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

#### products
- `id` - UUID (Primary Key)
- `name` - VARCHAR(255)
- `description` - TEXT
- `category` - VARCHAR(100)
- `botanical_name` - VARCHAR(255)
- `origin` - VARCHAR(255)
- `harvest_date` - DATE
- `qr_code` - TEXT UNIQUE
- `blockchain_hash` - VARCHAR(255)
- `owner_id` - UUID (Foreign Key → profiles)
- `certifications` - JSONB
- `metadata` - JSONB
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

#### supply_chain_events
- `id` - UUID (Primary Key)
- `product_id` - UUID (Foreign Key → products)
- `event_type` - VARCHAR(50)
- `actor_id` - UUID (Foreign Key → profiles)
- `location` - VARCHAR(255)
- `description` - TEXT
- `metadata` - JSONB
- `blockchain_hash` - VARCHAR(255)
- `timestamp` - TIMESTAMP

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Email Verification** - Required before login
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **CORS Protection** - Configurable origins
- ✅ **Helmet.js** - Security headers
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Sanitized inputs

---

## 👥 User Roles

- **Farmer** - Create products, add harvest events
- **Manufacturer** - Process products, add manufacturing events
- **Processor** - Process raw materials
- **Distributor** - Manage distribution
- **Retailer** - Retail operations
- **Consumer** - View product trace
- **Admin** - Full system access

---

## 🧪 Testing the Backend

### Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "farmer"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get profile (with token):
```bash
curl -X GET http://localhost:5001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Manual Email Verification (for testing)

If you haven't configured email yet, you can manually verify users:

```bash
cd backend
PGPASSWORD=root psql -U postgres -d herbtrace -c \
  "UPDATE profiles SET email_verified = true WHERE email = 'test@example.com';"
```

---

## 📁 Backend Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── index.ts               # Server entry point
│   ├── config/
│   │   └── index.ts           # Configuration management
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── productController.ts
│   │   ├── eventController.ts
│   │   └── traceController.ts
│   ├── db/
│   │   ├── index.ts           # Database connection
│   │   ├── schema.sql         # Database schema
│   │   └── migrations/
│   │       └── add_email_verification.sql
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── validation.ts      # Input validation
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── eventRoutes.ts
│   │   └── traceRoutes.ts
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── utils/
│       ├── blockchain.ts      # Blockchain integration
│       ├── email.ts           # Email service
│       ├── logger.ts          # Winston logger
│       └── qr.ts              # QR code generation
├── logs/                      # Application logs
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify database exists
psql -U postgres -l | grep herbtrace

# Test connection
psql -U postgres -d herbtrace
```

### Email Not Sending
1. Check Gmail App Password is correct (16 characters, no spaces)
2. Verify 2FA is enabled on Gmail account
3. Check backend logs: `tail -f backend/logs/error.log`
4. Test SMTP connection manually

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or use a different port in .env
PORT=5002
```

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to include frontend URL
- Example: `CORS_ORIGIN=http://localhost:5173,http://localhost:5175`

---

## 📚 Additional Documentation

- **Email Setup Guide**: `EMAIL_SETUP_GUIDE.md`
- **Email Verification Implementation**: `EMAIL_VERIFICATION_COMPLETE.md`
- **CORS Configuration**: `CORS_ISSUE_FIXED.md`
- **API Documentation**: `backend/API_DOCS.md`
- **Architecture Overview**: `backend/ARCHITECTURE.md`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Contact

**Project Maintainer:** Mahesh Arun Aladi
**Email:** mahesharunaladi@gmail.com
**GitHub:** [@Mahesharunaladi](https://github.com/Mahesharunaladi)

---

## 🎯 Quick Start Summary

```bash
# 1. Setup Database
psql -U postgres
CREATE DATABASE herbtrace;
\q

# 2. Install Backend
cd backend
npm install

# 3. Configure .env
# Edit backend/.env with your settings

# 4. Run Migrations
PGPASSWORD=root psql -U postgres -d herbtrace -f src/db/schema.sql
PGPASSWORD=root psql -U postgres -d herbtrace -f src/db/migrations/add_email_verification.sql

# 5. Start Server
npm run dev

# Backend is now running on http://localhost:5001 🚀
```

---

**Built with ❤️ for Smart India Hackathon**