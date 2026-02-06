import api from '../config/api';
import type { TraceData } from '../types';

export const traceService = {
  getFullTrace: async (productId: string) => {
    const response = await api.get<{ data: TraceData }>(`/trace/${productId}`);
    return response.data.data;
  },

  scanQR: async (qrData: string) => {
    const response = await api.post<{ data: TraceData }>('/trace/scan', { qrData });
    return response.data.data;
  },

  verifyBlockchain: async (productId: string) => {
    const response = await api.get<{ data: any }>(`/trace/${productId}/verify`);
    return response.data.data;
  },
};
