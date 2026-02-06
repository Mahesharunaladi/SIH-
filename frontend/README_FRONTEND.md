# HerbTrace Frontend

Modern React + TypeScript frontend for the HerbTrace blockchain-based botanical traceability system.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Role-based Access Control (Farmer, Manufacturer, Processor, Distributor, Retailer, Consumer, Admin)
- ✅ Product Management (Create, View, Update, Delete)
- ✅ Supply Chain Event Tracking
- ✅ Full Product Traceability with Timeline
- ✅ QR Code Display for Products
- ✅ Blockchain Verification Display
- ✅ User Profile Management
- ✅ Responsive Dashboard
- ✅ Clean, Modern UI

## Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Vite** - Build Tool

## Prerequisites

- Node.js >= 18.x
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── context/            # React Context (Auth)
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── ProductsList.tsx
│   ├── CreateProduct.tsx
│   ├── TracePage.tsx
│   └── Profile.tsx
├── services/           # API services
│   ├── authService.ts
│   ├── productService.ts
│   ├── eventService.ts
│   └── traceService.ts
├── types/              # TypeScript types
│   └── index.ts
├── config/             # Configuration
│   └── api.ts
├── App.tsx             # Main app component
├── App.css             # App styles
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## User Roles & Permissions

- **Farmer**: Can create products, record harvest events
- **Manufacturer**: Can create products, record processing events
- **Processor**: Can record processing events
- **Distributor**: Can record shipping and receive events
- **Retailer**: Can view and verify products
- **Consumer**: Can trace products and view history
- **Admin**: Full access to all features

## Pages

### Public Pages
- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Protected Pages (Requires Authentication)
- **Dashboard** (`/dashboard`) - Overview with stats and recent products
- **Products** (`/products`) - List all products with filters
- **Create Product** (`/products/create`) - Add new product (Farmer/Manufacturer/Admin only)
- **Trace** (`/trace`) - Track product supply chain history
- **Profile** (`/profile`) - View and edit user profile

## API Integration

The frontend connects to the HerbTrace backend API. Make sure the backend is running on `http://localhost:5000` or update the `VITE_API_BASE_URL` in `.env`.

### API Endpoints Used:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile
- `GET /products` - List products
- `POST /products` - Create product
- `GET /products/:id` - Get product details
- `GET /trace/:productId` - Get full trace data
- `POST /events` - Record supply chain event

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes are reflected immediately in development mode
2. **TypeScript**: Type checking is enabled - fix all type errors before building
3. **Authentication**: JWT tokens are stored in localStorage
4. **Protected Routes**: Use `ProtectedRoute` component to restrict access

## Styling

The application uses inline React styles for simplicity. Key color scheme:

- Primary Green: `#48bb78`
- Primary Blue: `#4299e1`
- Purple: `#9f7aea`
- Orange: `#ed8936`
- Dark: `#2d3748`
- Gray: `#718096`
- Background: `#f7fafc`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use TypeScript types
3. Keep components functional
4. Add proper error handling
5. Test authentication flows

## License

MIT
