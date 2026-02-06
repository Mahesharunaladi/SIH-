import api from '../config/api';
import type { AuthResponse, User } from '../types';

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    organization?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', { email, password });
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get<{ data: User }>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<{ data: User }>('/auth/profile', data);
    return response.data.data;
  },
};
