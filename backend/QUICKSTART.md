# HerbTrace Backend - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

1. **Prerequisites**: Install Docker and Docker Compose

2. **Start services**:
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Run migrations**:
   ```bash
   docker-compose exec backend npm run db:migrate
   ```

4. **Done!** API is running at `http://localhost:5000`

### Option 2: Local Setup

1. **Prerequisites**:
   - Node.js 18+
   - PostgreSQL 14+

2. **Run setup script**:
   ```bash
   cd backend
   ./setup.sh
   ```

3. **Configure environment**:
   ```bash
   # Edit .env file with your database credentials
   nano .env
   ```

4. **Start server**:
   ```bash
   npm run dev
   ```

5. **Done!** API is running at `http://localhost:5000`

## 📝 First API Calls

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "test1234",
    "name": "Test Farmer",
    "role": "farmer"
  }'
```

Save the `token` from the response!

### 3. Create a Product
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Ashwagandha Root",
    "quantity": 100,
    "unit": "kg",
    "originLatitude": 28.6139,
    "originLongitude": 77.2090
  }'
```

Save the `product.id` from the response!

### 4. Get Product Trace
```bash
curl http://localhost:5000/api/v1/trace/product/PRODUCT_ID
```

## 🎯 What Just Happened?

1. ✅ Product created with geo-location
2. ✅ Harvest event recorded
3. ✅ Data hashed and anchored to blockchain (mock)
4. ✅ QR code generated
5. ✅ Full trace available via API

## 📚 Next Steps

- Read full [API Documentation](API_DOCS.md)
- Check [README.md](README.md) for detailed setup
- Configure real blockchain (optional)
- Deploy to production

## 🐛 Troubleshooting

### Database connection fails
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Create database manually
createdb herbtrace
```

### Port 5000 already in use
```bash
# Change PORT in .env
PORT=3000
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 💡 Tips

- Use **mock blockchain** for development (`USE_MOCK_BLOCKCHAIN=true`)
- Enable **debug logging** (`LOG_LEVEL=debug`)
- Use **Postman** for easier API testing
- Check `logs/` folder for detailed logs

## 🎉 You're Ready!

The complete backend for HerbTrace is now running. Start integrating with your frontend or test all endpoints using the API documentation.

**Happy coding! 🌿**
