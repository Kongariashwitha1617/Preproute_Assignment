import { apiClient } from '@/lib/api/client';
import { filterValidSubTopics, buildSubTopicBlocklist } from '@/lib/utils/subTopicFilter';
import type { ApiResponse } from '@/types/api';
import type { MultiTopicsRequest, Subject, SubTopic, Topic } from '@/types/subject';

/** Staging DB has duplicate subjects where only the sibling has topics configured. */
const SUBJECT_TOPIC_FALLBACK_NAMES: Record<string, string> = {
  Maths: 'Mathematics',
};

async function fetchTopicsForSubjectId(subjectId: string): Promise<Topic[]> {
  const { data } = await apiClient.get<ApiResponse<Topic[]>>(
    `/topics/subject/${subjectId}`,
  );
  return data.data;
}

function findTopicFallbackSubject(
  subject: Subject,
  subjects: Subject[],
): Subject | undefined {
  const fallbackName = SUBJECT_TOPIC_FALLBACK_NAMES[subject.name];
  if (fallbackName) {
    return subjects.find((s) => s.name === fallbackName);
  }

  return subjects.find((s) => {
    if (s.id === subject.id) return false;
    const a = subject.name.toLowerCase();
    const b = s.name.toLowerCase();
    return a.length >= 4 && (b.includes(a) || a.includes(b));
  });
}

export async function getSubjects(): Promise<Subject[]> {
  const { data } = await apiClient.get<ApiResponse<Subject[]>>('/subjects');
  return data.data;
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const topics = await fetchTopicsForSubjectId(subjectId);
  if (topics.length > 0) return topics;

  const { data: subjectsData } = await apiClient.get<ApiResponse<Subject[]>>('/subjects');
  const subjects = subjectsData.data;
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return [];

  const fallbackSubject = findTopicFallbackSubject(subject, subjects);
  if (!fallbackSubject) return [];

  return fetchTopicsForSubjectId(fallbackSubject.id);
}

async function sanitizeSubTopics(
  subTopics: SubTopic[],
  topicIds: string[],
): Promise<SubTopic[]> {
  const subjects = await getSubjects();
  const blocklist = buildSubTopicBlocklist(subjects.map((s) => s.name));

  // Only keep sub-topics belonging to the requested topics (API should already do this).
  const allowedTopicIds = new Set(topicIds);
  const scoped = subTopics.filter((st) => allowedTopicIds.has(st.topic_id));

  return filterValidSubTopics(scoped, blocklist);
}

export async function getSubTopicsByTopic(topicId: string): Promise<SubTopic[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<SubTopic[]>>(
      `/sub-topics/topic/${topicId}`,
    );
    return sanitizeSubTopics(data.data, [topicId]);
  } catch {
    // Staging API may not expose GET /sub-topics/topic/:id — use multi-topics instead.
    return getSubTopicsByTopics({ topicIds: [topicId] });
  }
}

export async function getSubTopicsByTopics(
  payload: MultiTopicsRequest,
): Promise<SubTopic[]> {
  const { data } = await apiClient.post<ApiResponse<SubTopic[]>>(
    '/sub-topics/multi-topics',
    payload,
  );
  return sanitizeSubTopics(data.data, payload.topicIds);
}
