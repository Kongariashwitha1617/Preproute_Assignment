import { TEST_STATUSES, TEST_TYPES } from '@/lib/constants';
import type { SubTopic } from '@/types/subject';

const JUNK_NAME_PATTERNS: RegExp[] = [
  /^https?:\/\//i,
  /localhost/i,
  /:\/\//,
  /\?/,
  /\bnpm\b/i,
  /\bnpx\b/i,
  /\byarn\b/i,
  /\bnode\b/i,
  /\brun\s+(android|ios|dev|build|start|preview)/i,
  /^assign-test/i,
  /^admin\//i,
  /^[\w-]+\/[\w./-]+$/i,
  /^chapter[-\s]?wise$/i,
  /^mock[-\s]?test$/i,
  /^pyq$/i,
  /^\d+$/,
];

const EXTRA_BLOCKLIST = new Set(
  [
    'chapter-wise',
    'chapterwise',
    'chapter wise',
    'mock',
    'mock test',
    'pyq',
    'draft',
    'live',
    'scheduled',
    'unpublished',
    ...TEST_TYPES.flatMap((t) => [t.value, t.label, t.label.toLowerCase()]),
    ...TEST_STATUSES.map((s) => s.value),
  ].map(normalizeName),
);

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

/** Sub-topics should read like curriculum labels, not URLs, commands, or subject names. */
export function isValidSubTopicName(name: string, blocklistNames: string[] = []): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (trimmed.length > 80) return false;

  const normalized = normalizeName(trimmed);

  if (EXTRA_BLOCKLIST.has(normalized)) return false;

  for (const pattern of JUNK_NAME_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  if (trimmed.includes('/') && !trimmed.includes(' ')) return false;

  const blocklist = new Set(blocklistNames.map(normalizeName));
  if (blocklist.has(normalized)) return false;

  if (!looksLikeCurriculumLabel(trimmed)) return false;

  return true;
}

function looksLikeCurriculumLabel(name: string): boolean {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  // Reject long single-token keyboard spam (e.g. "iusdbfkdsbfk").
  if (words.length === 1) {
    const word = words[0]!;
    if (word.length >= 8 && word === word.toLowerCase() && !word.includes('-')) {
      return false;
    }
  }

  // Each word should start with a capital letter or be a short connector (e.g. "of").
  return words.every((word) => /^[A-Z0-9]/.test(word) || word.length <= 3);
}

export function filterValidSubTopics(
  subTopics: SubTopic[],
  blocklistNames: string[] = [],
): SubTopic[] {
  const seen = new Set<string>();

  return subTopics.filter((st) => {
    if (!isValidSubTopicName(st.name, blocklistNames)) return false;

    const key = normalizeName(st.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildSubTopicBlocklist(subjectNames: string[], topicNames: string[] = []): string[] {
  return [...subjectNames, ...topicNames];
}
