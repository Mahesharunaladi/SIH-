import api from '../config/api';
import type { Product } from '../types';

export const productService = {
  createProduct: async (data: {
    name: string;
    scientificName?: string;
    description?: string;
    category?: string;
    quantity: number;
    unit: string;
    harvestDate?: string;
    batchNumber: string;
    originLatitude?: number;
    originLongitude?: number;
    originAccuracy?: number;
  }) => {
    const response = await api.post<{ data: { product: Product } }>('/products', data);
    return response.data.data;
  },

  getProducts: async (filters?: {
    status?: string;
    category?: string;
    createdBy?: string;
  }) => {
    const response = await api.get<{ data: Product[] }>('/products', { params: filters });
    return response.data.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await api.put<{ data: Product }>(`/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete<{ data: any }>(`/products/${id}`);
    return response.data.data;
  },
};
