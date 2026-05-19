import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ApiResponse } from '@/types';
import { authService } from '@/services/auth.service';
import type { LoginInput, RegisterInput } from '@/services/auth.service';
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(data);
          const { user, token } = res.data.data!;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const axiosErr = err as AxiosError<ApiResponse>;
          set({
            error: axiosErr.response?.data?.message ?? 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.register(data);
          const { user, token } = res.data.data!;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const axiosErr = err as AxiosError<ApiResponse>;
          set({
            error: axiosErr.response?.data?.message ?? 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
