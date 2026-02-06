# 🚀 Quick Start Guide - HerbTrace Frontend

## Step 1: Verify Prerequisites

Make sure you have:
- ✅ Node.js >= 18.x installed
- ✅ Backend server running on http://localhost:5000
- ✅ Terminal/Command prompt open

Check Node.js version:
```bash
node --version
```

## Step 2: Navigate to Frontend Directory

```bash
cd /Users/mahesharunaladi/Documents/SIH/SIH-/frontend
```

## Step 3: Install Dependencies (if not already done)

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v7.x ready in XXXms
➜ Local: http://localhost:5173/
```

## Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

## Step 6: Test the Application

### Register a New User

1. Click **"Register"** on the home page
2. Fill in the registration form:
   - **Name**: John Farmer
   - **Email**: farmer@example.com
   - **Password**: SecurePass123!
   - **Role**: Farmer
   - **Organization**: Green Farms Ltd
   - **Phone**: +1234567890
3. Click **"Register"**
4. You'll be automatically logged in and redirected to the dashboard

### Create a Product (Farmer/Manufacturer Role)

1. From Dashboard, click **"Add New Product"**
2. Fill in the product form:
   - **Product Name**: Ashwagandha Root
   - **Scientific Name**: Withania somnifera
   - **Description**: Organic Ashwagandha roots
   - **Category**: Medicinal Herb
   - **Quantity**: 100
   - **Unit**: kg
   - **Batch Number**: ASH-2026-001
   - **Harvest Date**: Select current date
   - **Latitude**: 28.6139 (optional)
   - **Longitude**: 77.2090 (optional)
3. Click **"Create Product"**
4. Product will be created with QR code

### View Products

1. Navigate to **"Products"** from the navbar
2. See all products in cards
3. Use filters to filter by status
4. Click **"View Details"** to see full product info
5. Click **"Trace"** to see supply chain history

### Trace a Product

1. Navigate to **"Trace"** from the navbar
2. Enter a product ID (copy from product details)
3. Click **"Trace"**
4. View:
   - Product information
   - Supply chain timeline
   - Blockchain verification proofs
   - Actor information
   - Locations

### Update Profile

1. Navigate to **"Profile"** from the navbar
2. Click **"Edit Profile"**
3. Update your information
4. Click **"Save Changes"**

### Logout

Click **"Logout"** from the navbar

## 🎯 Test User Credentials

After registering, you can use these credentials to login:

```
Email: farmer@example.com
Password: SecurePass123!
```

Or create multiple users with different roles:
- farmer@example.com (Farmer)
- manufacturer@example.com (Manufacturer)
- distributor@example.com (Distributor)
- retailer@example.com (Retailer)
- consumer@example.com (Consumer)

## 📝 Important Notes

1. **Backend Must Be Running**: The frontend requires the backend API to be running on http://localhost:5000

2. **Check Backend**: If you get connection errors, verify backend is running:
   ```bash
   # In another terminal
   cd ../backend
   npm run dev
   ```

3. **CORS**: Backend should have CORS enabled for http://localhost:5173

4. **Database**: Backend database must be set up and migrated

5. **Environment**: Check `.env` file exists in frontend folder with:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

## 🐛 Troubleshooting

### Problem: "Cannot connect to server"
**Solution**: Make sure backend is running on port 5000

### Problem: "404 errors on API calls"
**Solution**: Check backend routes and API_BASE_URL in .env

### Problem: "Unauthorized" errors
**Solution**: Try logging out and logging in again

### Problem: "Port 5173 already in use"
**Solution**: Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

### Problem: Module not found errors
**Solution**: Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎨 UI Overview

- **Green buttons**: Primary actions (Create, Save, Login)
- **Blue buttons**: View/Info actions
- **Purple buttons**: Trace actions
- **Red buttons**: Logout/Delete actions
- **Status badges**: Color-coded by product status

## 📱 Pages Summary

| Page | URL | Access | Description |
|------|-----|--------|-------------|
| Home | `/` | Public | Landing page |
| Login | `/login` | Public | User login |
| Register | `/register` | Public | User registration |
| Dashboard | `/dashboard` | Protected | Overview with stats |
| Products | `/products` | Protected | Product list |
| Create Product | `/products/create` | Farmer/Manufacturer | Add new product |
| Trace | `/trace` | Protected | Product traceability |
| Profile | `/profile` | Protected | User profile |

## 🚀 Ready to Go!

Your HerbTrace frontend is now running and ready to use!

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5000

Enjoy using HerbTrace! 🌿✨
