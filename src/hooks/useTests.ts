import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';
import {
  createTest,
  deleteTest,
  getTestById,
  getTests,
  publishTest,
  updateTest,
} from '@/services/testService';
import type { CreateTestRequest, UpdateTestRequest } from '@/types/test';

export const testKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
};

export function useTests() {
  return useQuery({
    queryKey: testKeys.all,
    queryFn: getTests,
    retry: 2,
  });
}

export function useTest(id: string | undefined) {
  return useQuery({
    queryKey: testKeys.detail(id ?? ''),
    queryFn: () => getTestById(id!),
    enabled: Boolean(id),
    retry: 2,
  });
}

export function useCreateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTestRequest) => createTest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: testKeys.all });
      toast.success('Test created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTestRequest;
      suppressToast?: boolean;
    }) => updateTest(id, payload),
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({ queryKey: testKeys.all });
      void queryClient.invalidateQueries({ queryKey: testKeys.detail(data.id) });
      if (!variables.suppressToast) {
        toast.success('Test updated successfully');
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: testKeys.all });
      toast.success('Test deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function usePublishTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishTest(id),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: testKeys.all });
      void queryClient.invalidateQueries({ queryKey: testKeys.detail(data.id) });
      toast.success('Test published successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
