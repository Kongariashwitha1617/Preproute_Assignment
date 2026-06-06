export const AUTH_TOKEN_KEY = 'preproute_auth_token';
export const AUTH_USER_KEY = 'preproute_auth_user';

export const TEST_TYPES = [
  { value: 'chapterwise', label: 'Chapter Wise' },
  { value: 'pyq', label: 'PYQ' },
  { value: 'mock', label: 'Mock Test' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Difficult' },
] as const;

export const TEST_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'unpublished', label: 'Unpublished' },
] as const;

export const CORRECT_OPTION_VALUES = [
  { value: 'option1', label: 'Option A' },
  { value: 'option2', label: 'Option B' },
  { value: 'option3', label: 'Option C' },
  { value: 'option4', label: 'Option D' },
] as const;

export type TestType = (typeof TEST_TYPES)[number]['value'];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]['value'];
export type TestStatus = (typeof TEST_STATUSES)[number]['value'];
export type CorrectOption = (typeof CORRECT_OPTION_VALUES)[number]['value'];
