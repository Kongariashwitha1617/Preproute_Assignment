import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/client';
import {
  bulkCreateQuestions,
  deleteQuestion,
  fetchBulkQuestions,
  updateQuestion,
} from '@/services/questionService';
import { testKeys } from '@/hooks/useTests';
import type { BulkCreateQuestionsRequest, UpdateQuestionRequest } from '@/types/question';

export const questionKeys = {
  bulk: (ids: string[]) => ['questions', ...ids] as const,
};

export function useFetchBulkQuestions(questionIds: string[]) {
  return useQuery({
    queryKey: questionKeys.bulk(questionIds),
    queryFn: () => fetchBulkQuestions({ question_ids: questionIds }),
    enabled: questionIds.length > 0,
    retry: 2,
  });
}

export function useBulkCreateQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: BulkCreateQuestionsRequest;
      suppressToast?: boolean;
    }) => bulkCreateQuestions(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: testKeys.all });
      if (!variables.suppressToast) {
        toast.success('Questions saved successfully');
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionRequest;
      suppressToast?: boolean;
    }) => updateQuestion(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (!variables.suppressToast) {
        toast.success('Question updated successfully');
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
