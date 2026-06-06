import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/lib/constants';
import type { User } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'preproute-auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
