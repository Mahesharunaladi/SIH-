export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'manufacturer' | 'processor' | 'distributor' | 'retailer' | 'consumer' | 'admin';
  organization?: string;
  phone?: string;
  verified: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  category?: string;
  quantity: number;
  unit: string;
  batch_number: string;
  status: 'HARVESTED' | 'PROCESSED' | 'PACKAGED' | 'IN_TRANSIT' | 'DELIVERED' | 'VERIFIED' | 'REJECTED';
  harvest_date?: string;
  origin_latitude?: number;
  origin_longitude?: number;
  qr_code?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyChainEvent {
  id: string;
  product_id: string;
  event_type: 'HARVEST' | 'PROCESS' | 'PACKAGE' | 'SHIP' | 'RECEIVE' | 'VERIFY' | 'QUALITY_CHECK' | 'TRANSFER';
  description: string;
  actor_id: string;
  actor_name?: string;
  actor_role?: string;
  location_latitude?: number;
  location_longitude?: number;
  metadata?: Record<string, any>;
  timestamp: string;
  blockchain_tx_hash?: string;
}

export interface BlockchainProof {
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: number;
  verified: boolean;
}

export interface TraceData {
  product: Product;
  events: SupplyChainEvent[];
  blockchainProofs: BlockchainProof[];
  certificates?: any[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
