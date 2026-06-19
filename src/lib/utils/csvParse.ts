import type { QuestionFormValues } from '@/features/questions/schemas/questionSchema';

type CorrectOption = QuestionFormValues['correct_option'];

const CSV_HEADERS = [
  'question',
  'option1',
  'option2',
  'option3',
  'option4',
  'correct_option',
  'explanation',
  'difficulty',
  'topic',
  'sub_topic',
  'media_url',
] as const;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeCorrectOption(value: string): CorrectOption | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '');

  const map: Record<string, CorrectOption> = {
    a: 'option1',
    '1': 'option1',
    option1: 'option1',
    optiona: 'option1',
    b: 'option2',
    '2': 'option2',
    option2: 'option2',
    optionb: 'option2',
    c: 'option3',
    '3': 'option3',
    option3: 'option3',
    optionc: 'option3',
    d: 'option4',
    '4': 'option4',
    option4: 'option4',
    optiond: 'option4',
  };

  return map[normalized] ?? null;
}

function normalizeDifficulty(
  value: string | undefined,
): QuestionFormValues['difficulty'] {
  if (!value?.trim()) return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'easy' || v === 'medium' || v === 'hard') return v;
  return undefined;
}

export interface CsvParseResult {
  questions: QuestionFormValues[];
  errors: string[];
}

export function parseQuestionsCsv(text: string): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { questions: [], errors: ['CSV file is empty'] };
  }

  const firstLine = lines[0]!;
  const headerCells = parseCsvLine(firstLine).map((h) => h.toLowerCase());
  const hasHeader = headerCells.includes('question') && headerCells.includes('option1');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const headerIndex = hasHeader
    ? Object.fromEntries(headerCells.map((h, i) => [h, i]))
    : Object.fromEntries(CSV_HEADERS.map((h, i) => [h, i]));

  const questions: QuestionFormValues[] = [];
  const errors: string[] = [];

  dataLines.forEach((line, index) => {
    const rowNumber = hasHeader ? index + 2 : index + 1;
    const cells = parseCsvLine(line);

    const get = (key: (typeof CSV_HEADERS)[number]) => {
      const idx = headerIndex[key];
      return idx !== undefined ? (cells[idx] ?? '').trim() : '';
    };

    const question = get('question');
    const option1 = get('option1');
    const option2 = get('option2');
    const option3 = get('option3');
    const option4 = get('option4');
    const correctRaw = get('correct_option');
    const correct_option = normalizeCorrectOption(correctRaw);

    if (!question || !option1 || !option2 || !option3 || !option4) {
      errors.push(`Row ${rowNumber}: missing required question or option fields`);
      return;
    }

    if (!correct_option) {
      errors.push(`Row ${rowNumber}: invalid correct_option "${correctRaw}"`);
      return;
    }

    const media_url = get('media_url');
    const difficulty = normalizeDifficulty(get('difficulty'));

    questions.push({
      question,
      option1,
      option2,
      option3,
      option4,
      correct_option,
      explanation: get('explanation') || undefined,
      difficulty,
      topic: get('topic') || undefined,
      sub_topic: get('sub_topic') || undefined,
      media_url: media_url || '',
    });
  });

  return { questions, errors };
}
