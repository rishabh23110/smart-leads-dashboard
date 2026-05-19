import api from './api';
import type { ApiResponse, User } from '@/types';

export interface LoginInput { email: string; password: string; }
export interface RegisterInput { name: string; email: string; password: string; role?: 'admin' | 'sales'; }

export const authService = {
  login: (data: LoginInput) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),

  register: (data: RegisterInput) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),

  getMe: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/me'),
};
