import { z } from 'zod';

export const testFormSchema = z.object({
  name: z.string().min(1, 'Test name is required').max(200, 'Test name is too long'),
  subject: z.string().min(1, 'Subject is required'),
  type: z.enum(['chapterwise', 'mock', 'pyq'], {
    message: 'Test type is required',
  }),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  sub_topics: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    message: 'Difficulty is required',
  }),
  correct_marks: z.number({ error: 'Correct marks is required' }).min(0, 'Correct marks must be 0 or more'),
  wrong_marks: z.number({ error: 'Wrong marks is required' }),
  unattempt_marks: z.number({ error: 'Unattempt marks is required' }),
  total_time: z.number({ error: 'Total time is required' }).min(1, 'Total time must be at least 1 minute'),
  total_marks: z.number({ error: 'Total marks is required' }).min(1, 'Total marks must be at least 1'),
  total_questions: z.number({ error: 'Total questions is required' }).min(1, 'Total questions must be at least 1'),
});

export type TestFormValues = z.infer<typeof testFormSchema>;
