export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

export interface ChainProof {
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: number;
  gasUsed?: string;
  network?: string;
}

export enum UserRole {
  FARMER = 'farmer',
  MANUFACTURER = 'manufacturer',
  PROCESSOR = 'processor',
  DISTRIBUTOR = 'distributor',
  RETAILER = 'retailer',
  CONSUMER = 'consumer',
  ADMIN = 'admin',
}

export enum EventType {
  HARVEST = 'HARVEST',
  PROCESSING = 'PROCESSING',
  QUALITY_TEST = 'QUALITY_TEST',
  PACKAGING = 'PACKAGING',
  SHIPMENT = 'SHIPMENT',
  TRANSFER = 'TRANSFER',
  LISTING = 'LISTING',
  SCAN = 'SCAN',
  VERIFICATION = 'VERIFICATION',
}

export enum ProductStatus {
  HARVESTED = 'HARVESTED',
  IN_PROCESSING = 'IN_PROCESSING',
  PROCESSED = 'PROCESSED',
  PACKAGED = 'PACKAGED',
  IN_TRANSIT = 'IN_TRANSIT',
  IN_WAREHOUSE = 'IN_WAREHOUSE',
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RECALLED = 'RECALLED',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organization?: string;
  phone?: string;
  address?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  scientificName?: string;
  description?: string;
  category?: string;
  quantity: number;
  unit: string;
  status: ProductStatus;
  currentOwnerId: string;
  originLocation?: GeoPoint;
  harvestDate?: Date;
  batchNumber?: string;
  qrCode?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplyChainEvent {
  id: string;
  productId: string;
  eventType: EventType;
  timestamp: Date;
  performedBy: string;
  location?: GeoPoint;
  description?: string;
  metadata?: Record<string, any>;
  dataHash: string;
  blockchainTxId?: string;
  verified: boolean;
}

export interface BlockchainTransaction {
  id: string;
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: number;
  network: string;
  eventId: string;
  dataHash: string;
  gasUsed?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

export interface Certificate {
  id: string;
  productId: string;
  certificateType: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  documentHash: string;
  documentUrl?: string;
  verified: boolean;
  createdAt: Date;
}

export interface TraceData {
  product: Product;
  events: SupplyChainEvent[];
  blockchainProofs: BlockchainTransaction[];
  certificates: Certificate[];
  participants: User[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
