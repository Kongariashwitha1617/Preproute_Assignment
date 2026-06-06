import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    credentials,
  );
  return data.data;
}
