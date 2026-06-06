import type { CorrectOption, DifficultyLevel } from '@/lib/constants';

export interface Question {
  id: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation: string | null;
  difficulty: DifficultyLevel | null;
  paragraph: string | null;
  media_url: string | null;
  test_id: string | null;
  subject: string | null;
  topic: string | null;
  sub_topic: string | null;
  category: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface CreateQuestionPayload {
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation?: string;
  difficulty?: DifficultyLevel;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id: string;
  subject: string;
}

export interface BulkCreateQuestionsRequest {
  questions: CreateQuestionPayload[];
}

export interface FetchBulkQuestionsRequest {
  question_ids: string[];
}

export interface UpdateQuestionRequest {
  question?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correct_option?: CorrectOption;
  explanation?: string;
  difficulty?: DifficultyLevel;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}

export interface LocalQuestion extends CreateQuestionPayload {
  localId: string;
  serverId?: string;
}
