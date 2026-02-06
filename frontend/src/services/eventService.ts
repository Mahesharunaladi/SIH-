import api from '../config/api';
import type { SupplyChainEvent } from '../types';

export const eventService = {
  recordEvent: async (data: {
    productId: string;
    eventType: string;
    description: string;
    locationLatitude?: number;
    locationLongitude?: number;
    locationAccuracy?: number;
    metadata?: Record<string, any>;
  }) => {
    const response = await api.post<{ data: { event: SupplyChainEvent } }>('/events', data);
    return response.data.data;
  },

  getEventsByProduct: async (productId: string) => {
    const response = await api.get<{ data: SupplyChainEvent[] }>(`/events/product/${productId}`);
    return response.data.data;
  },

  verifyEvent: async (eventId: string) => {
    const response = await api.post<{ data: any }>(`/events/${eventId}/verify`);
    return response.data.data;
  },
};
