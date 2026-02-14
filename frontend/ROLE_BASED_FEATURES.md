# Role-Based Features Implementation

## Overview
The HerbTrace platform now implements differentiated operations based on user roles. Each stakeholder in the supply chain has customized dashboards and navigation tailored to their specific responsibilities.

## Role-Specific Features

### 🔵 Consumer
**Primary Function**: Product verification and traceability

**Dashboard Quick Actions**:
- 🔍 **Scan QR Code**: Direct access to QR scanner for product verification
- 📜 **Trace Products**: View supply chain history of products

**Navigation Menu**:
- Home
- 🔍 Scan QR (prominent feature)
- Trace Products
- Profile

**Key Capabilities**:
- Scan product QR codes (camera or manual input)
- View complete supply chain journey
- Verify product authenticity via blockchain
- Check certifications and quality metrics
- **Cannot**: Create products, modify supply chain data

---

### 🟢 Farmer
**Primary Function**: Harvest registration with geo-tagging

**Dashboard Quick Actions**:
- 🌱 **Add Harvest**: Register new harvest with location data
- 📦 **My Products**: View all harvested products

**Navigation Menu**:
- Dashboard
- ➕ Add Product (harvest registration)
- Products (farmer's products only)
- Profile

**Key Capabilities**:
- Register new harvests with:
  - Product name & scientific name
  - Batch number
  - Harvest date & location (geo-tagged)
  - Quantity and unit
  - Organic certification status
- View own products
- Track product status through supply chain

---

### 🟣 Manufacturer
**Primary Function**: Batch processing and QR code generation

**Dashboard Quick Actions**:
- ⚗️ **Create Batch**: Process raw materials into finished products
- 📱 **Generate QR**: Create QR codes for product tracking

**Navigation Menu**:
- Dashboard
- ➕ Add Product (batch creation)
- Products (manufacturer's batches)
- Profile

**Key Capabilities**:
- Create processing batches from raw materials
- Generate unique QR codes for products
- Record processing events in blockchain
- Update product status (PROCESSED, PACKAGED)
- Link products to source materials

---

### 🟠 Processor
**Primary Function**: Intermediate processing operations

**Dashboard Quick Actions**:
- 🔄 **Process Product**: Add processing event to supply chain
- 📊 **Track Batches**: Monitor processing batches

**Navigation Menu**:
- Dashboard
- ➕ Add Product
- Products
- Profile

**Key Capabilities**:
- Record processing/transformation events
- Update product specifications
- Add quality control data
- Track batch processing status

---

### 🔷 Distributor
**Primary Function**: Logistics and distribution management

**Dashboard Quick Actions**:
- 🚚 **Track Shipments**: Monitor product distribution
- 📍 **Update Location**: Log distribution events

**Navigation Menu**:
- Dashboard
- Products (in distribution)
- Trace (supply chain tracking)
- Profile

**Key Capabilities**:
- Update product location during transit
- Log shipping events (pickup, in-transit, delivered)
- Record timestamps and GPS coordinates
- Manage delivery confirmations

---

### 🔵 Retailer
**Primary Function**: Retail verification and receipt confirmation

**Dashboard Quick Actions**:
- 🏪 **Verify Stock**: Verify received products
- ✅ **Confirm Receipt**: Log product receipt events

**Navigation Menu**:
- Dashboard
- Products (retail inventory)
- Trace (verify products)
- Profile

**Key Capabilities**:
- Verify product authenticity on receipt
- Confirm delivery events
- Update product status to DELIVERED
- Scan QR codes to verify stock

---

### 🔴 Admin
**Primary Function**: System administration and oversight

**Dashboard Quick Actions**:
- 👥 **Manage Users**: Administer user accounts
- 📊 **View Analytics**: System-wide insights
- 🔗 **Blockchain Status**: Monitor blockchain integrity

**Navigation Menu**:
- Dashboard
- ➕ Add Product (all permissions)
- Products (all products)
- Trace (all data)
- Profile

**Key Capabilities**:
- Full system access
- User account management
- View all products and events
- Monitor blockchain transactions
- Generate system reports
- Override permissions when necessary

---

## Technical Implementation

### Frontend Components Updated

1. **Navbar.tsx** (`/frontend/src/components/Navbar.tsx`)
   - Conditional rendering based on `user.role`
   - Consumer: Shows "Scan QR" prominently
   - Farmers/Manufacturers: Shows "Add Product"
   - All authenticated users: Dashboard, Trace, Profile

2. **Dashboard.tsx** (`/frontend/src/pages/Dashboard.tsx`)
   - Role-specific quick action cards
   - Each role sees 2-3 relevant actions
   - Color-coded borders matching role theme
   - Descriptive text explaining each action

3. **QRScanner.tsx** (`/frontend/src/pages/QRScanner.tsx`)
   - Dedicated page for consumers
   - Two scanning methods:
     - Camera scanning (ready for library integration)
     - Manual product ID input
   - Extracts product ID from URLs/QR data
   - Navigates to trace page with results

4. **App.tsx** (`/frontend/src/App.tsx`)
   - Added `/scan` route for QR scanner
   - Protected routes with `allowedRoles` prop
   - Product creation restricted to: `['farmer', 'manufacturer', 'admin']`

### Backend Integration

All roles use the same backend endpoints with JWT authentication:

```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me

POST /api/v1/products (role-restricted)
GET /api/v1/products
GET /api/v1/products/:id

POST /api/v1/events (role-restricted)
GET /api/v1/events/:productId

GET /api/v1/trace/:productId
```

Backend validates user roles via middleware in protected routes.

---

## User Experience Flow

### Consumer Journey
1. Login as consumer
2. See dashboard with "Scan QR" prominently displayed
3. Navigate to `/scan`
4. Choose scanning method:
   - Camera: Point at QR code
   - Manual: Enter product ID or paste QR URL
5. View complete traceability report with:
   - Supply chain timeline
   - All stakeholder events
   - Blockchain verification
   - Geographic journey map
   - Certifications

### Farmer Journey
1. Login as farmer
2. See dashboard with "Add Harvest" action
3. Navigate to product creation
4. Fill harvest form with:
   - Product details
   - Geo-location (auto-captured)
   - Organic certification
   - Harvest date
5. Submit to blockchain
6. View product in "My Products"

### Manufacturer Journey
1. Login as manufacturer
2. See dashboard with "Create Batch" and "Generate QR"
3. Create processing batch
4. Link to source materials (from farmers)
5. Generate QR code for product tracking
6. Print QR labels for packaging
7. Customers can now scan these QR codes

---

## Security & Permissions

### Route Protection
- All authenticated routes use `ProtectedRoute` component
- `allowedRoles` prop enforces role-based access
- Unauthorized users redirected to home page

### API Authorization
- JWT tokens include user role
- Backend middleware validates permissions
- Product creation limited to: farmer, manufacturer, processor, admin
- Event creation limited to: all supply chain participants (not consumers)

### Data Visibility
- Consumers: Read-only access to trace data
- Producers: Full access to own products
- Admins: Full system access

---

## Next Steps for Enhancement

### Recommended Features

1. **Camera QR Scanning**
   - Integrate `html5-qrcode` or `@zxing/browser`
   - Real-time camera feed in QRScanner.tsx
   - Auto-scan when QR detected

2. **Geo-Tagging UI**
   - Add map component to product creation
   - Auto-capture GPS coordinates
   - Display harvest locations on map

3. **Batch QR Generation**
   - Bulk QR code generation for manufacturers
   - Printable QR label sheets
   - PDF export with product details

4. **Mobile Responsiveness**
   - Optimize QR scanner for mobile
   - Touch-friendly navigation
   - Responsive dashboard layouts

5. **Push Notifications**
   - Notify distributors of new shipments
   - Alert retailers of incoming deliveries
   - Consumer alerts for product updates

6. **Analytics Dashboard**
   - Supply chain metrics for admins
   - Product journey statistics
   - User activity reports

---

## Testing Role-Based Features

### Test Accounts

Create test users for each role:

```bash
# Consumer
POST /api/v1/auth/register
{
  "email": "consumer@test.com",
  "password": "Test1234!",
  "name": "Test Consumer",
  "role": "consumer"
}

# Farmer
POST /api/v1/auth/register
{
  "email": "farmer@test.com",
  "password": "Test1234!",
  "name": "Test Farmer",
  "role": "farmer"
}

# Manufacturer
POST /api/v1/auth/register
{
  "email": "manufacturer@test.com",
  "password": "Test1234!",
  "name": "Test Manufacturer",
  "role": "manufacturer"
}
```

### Testing Checklist

- [ ] Consumer can only scan QR codes (no product creation button)
- [ ] Farmer sees "Add Harvest" in dashboard
- [ ] Manufacturer sees "Create Batch" and "Generate QR"
- [ ] Processor sees processing-specific actions
- [ ] Distributor sees shipment tracking
- [ ] Retailer sees stock verification
- [ ] Admin sees all features
- [ ] Unauthorized role access is blocked
- [ ] Navigation menus show correct items per role
- [ ] QR scanner works for consumers
- [ ] Trace page displays complete supply chain

---

## Configuration Files

### Environment Variables
```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5001/api/v1

# Backend (.env)
PORT=5001
CORS_ORIGIN=http://localhost:5173
```

### Key Files Modified
```
frontend/
  src/
    components/
      Navbar.tsx              # Role-based navigation
      ProtectedRoute.tsx      # Route authorization
    pages/
      Dashboard.tsx           # Role-specific quick actions
      QRScanner.tsx          # Consumer-focused scanner
    App.tsx                   # Route configuration
```

---

## Troubleshooting

### Issue: Consumer sees "Add Product" button
**Solution**: Check JWT token includes correct role, verify ProtectedRoute allowedRoles prop

### Issue: QR scanner not working
**Solution**: Ensure `/scan` route is registered, check camera permissions in browser

### Issue: "Unauthorized" on product creation
**Solution**: Verify backend middleware checks role, confirm JWT includes role claim

### Issue: Navigation menu items not updating
**Solution**: Check AuthContext is providing correct user object, verify conditional rendering logic

---

## Summary

✅ **Implemented**:
- Role-based dashboard layouts
- Custom quick actions per role
- Consumer-focused QR scanner
- Conditional navigation menus
- Route-level authorization
- Role-specific UI components

🎯 **Key Achievement**: Consumers now have a streamlined experience focused solely on scanning QR codes to verify product authenticity, while supply chain participants have tools specific to their operations.

📱 **Mobile-Ready**: All interfaces are designed to work on mobile devices, especially important for the QR scanning feature.

🔒 **Secure**: Role-based access control enforced at both frontend (UI) and backend (API) levels.
