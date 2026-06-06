import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { CreateTestRequest, Test, UpdateTestRequest } from '@/types/test';

export async function getTests(): Promise<Test[]> {
  const { data } = await apiClient.get<ApiResponse<Test[]>>('/tests');
  return data.data;
}

export async function getTestById(id: string): Promise<Test> {
  const { data } = await apiClient.get<ApiResponse<Test>>(`/tests/${id}`);
  return data.data;
}

export async function createTest(payload: CreateTestRequest): Promise<Test> {
  const { data } = await apiClient.post<ApiResponse<Test>>('/tests', payload);
  return data.data;
}

export async function updateTest(id: string, payload: UpdateTestRequest): Promise<Test> {
  const { data } = await apiClient.put<ApiResponse<Test>>(`/tests/${id}`, payload);
  return data.data;
}

export async function deleteTest(id: string): Promise<void> {
  await apiClient.delete(`/tests/${id}`);
}

export async function publishTest(id: string): Promise<Test> {
  return updateTest(id, { status: 'live' });
}
