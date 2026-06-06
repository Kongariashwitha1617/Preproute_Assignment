import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import type { ApiErrorResponse } from '@/types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://admin-moderator-backend-staging.up.railway.app/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('preproute_auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Unable to reach the server. Check your connection or restart the dev server.';
    }

    const validationErrors = error.response?.data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      const first = validationErrors[0] as { msg?: string };
      if (first.msg) return first.msg;
    }

    return error.response?.data?.message ?? error.message ?? 'Something went wrong';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}
