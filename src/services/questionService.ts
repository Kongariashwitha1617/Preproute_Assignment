import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  BulkCreateQuestionsRequest,
  FetchBulkQuestionsRequest,
  Question,
  UpdateQuestionRequest,
} from '@/types/question';

export async function bulkCreateQuestions(
  payload: BulkCreateQuestionsRequest,
): Promise<Question[]> {
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/bulk',
    payload,
  );
  return data.data;
}

export async function fetchBulkQuestions(
  payload: FetchBulkQuestionsRequest,
): Promise<Question[]> {
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/fetchBulk',
    payload,
  );
  return data.data;
}

export async function updateQuestion(
  id: string,
  payload: UpdateQuestionRequest,
): Promise<Question> {
  const { data } = await apiClient.put<ApiResponse<Question>>(
    `/questions/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteQuestion(id: string): Promise<void> {
  await apiClient.delete(`/questions/${id}`);
}
