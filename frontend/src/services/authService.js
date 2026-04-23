import api from './api';
import { mockUser } from '../utils/mockData';

const USE_MOCK = true;

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (email && password) {
        return {
          accessToken: 'mock-jwt-token',
          user: mockUser,
        };
      }
      throw new Error('Geçersiz e-posta veya şifre');
    }
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(userData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        accessToken: 'mock-jwt-token',
        user: {
          ...mockUser,
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      };
    }
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  async getMe() {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUser;
    }
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile(profileData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In mock mode, merge with mockUser (in real app, server would return updated user)
      const updatedUser = { ...mockUser, ...profileData };
      return updatedUser;
    }
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Şifre başarıyla değiştirildi' };
    }
    const { data } = await api.put('/auth/password', { currentPassword, newPassword });
    return data;
  },
};
