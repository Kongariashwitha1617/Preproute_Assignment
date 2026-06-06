import { useQuery } from '@tanstack/react-query';
import { filterValidUuids } from '@/lib/utils/resolveIds';
import {
  getSubjects,
  getSubTopicsByTopic,
  getSubTopicsByTopics,
  getTopicsBySubject,
} from '@/services/subjectService';

export const subjectKeys = {
  all: ['subjects'] as const,
  topics: (subjectId: string) => ['topics', subjectId] as const,
  subTopics: (topicId: string) => ['sub-topics', topicId] as const,
  multiSubTopics: (topicIds: string[]) => ['sub-topics-multi', ...topicIds] as const,
};

export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.all,
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopics(subjectId: string | undefined) {
  return useQuery({
    queryKey: subjectKeys.topics(subjectId ?? ''),
    queryFn: () => getTopicsBySubject(subjectId!),
    enabled: Boolean(subjectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubTopics(topicId: string | undefined) {
  return useQuery({
    queryKey: subjectKeys.subTopics(topicId ?? ''),
    queryFn: () => getSubTopicsByTopic(topicId!),
    enabled: Boolean(topicId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMultiSubTopics(topicIds: string[]) {
  const validTopicIds = filterValidUuids(topicIds);

  return useQuery({
    queryKey: subjectKeys.multiSubTopics(validTopicIds),
    queryFn: () => getSubTopicsByTopics({ topicIds: validTopicIds }),
    enabled: validTopicIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
