import type { DifficultyLevel, TestStatus, TestType } from '@/lib/constants';

export interface Test {
  id: string;
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: string[] | null;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: DifficultyLevel;
  total_marks: number;
  total_time: number;
  total_questions: number;
  status: TestStatus | string | null;
  created_at: string;
  updated_at: string | null;
  created_by?: number;
  updated_by?: number | null;
  slot?: string | null;
  hidden_from_moderator?: boolean | null;
  paragraph_question?: string | null;
  scheduled_date?: string | null;
  expiry_date?: string | null;
  original_files?: string[];
}

export interface CreateTestRequest {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: DifficultyLevel;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: TestStatus | null;
}

export interface UpdateTestRequest {
  name?: string;
  type?: TestType;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  questions?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: DifficultyLevel;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  status?: TestStatus | string;
  scheduled_date?: string | null;
  expiry_date?: string | null;
}
