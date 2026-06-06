import { z } from 'zod';

export const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  option1: z.string().min(1, 'Option A is required'),
  option2: z.string().min(1, 'Option B is required'),
  option3: z.string().min(1, 'Option C is required'),
  option4: z.string().min(1, 'Option D is required'),
  correct_option: z.enum(['option1', 'option2', 'option3', 'option4'], {
    message: 'Correct answer is required',
  }),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  topic: z.string().optional(),
  sub_topic: z.string().optional(),
  media_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
