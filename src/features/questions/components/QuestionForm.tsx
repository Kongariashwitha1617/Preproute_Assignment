import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CORRECT_OPTION_VALUES, DIFFICULTY_LEVELS } from '@/lib/constants';
import { questionSchema, type QuestionFormValues } from '../schemas/questionSchema';
import type { SelectOption } from '@/components/ui/Select';

interface QuestionFormProps {
  topicOptions: SelectOption[];
  subTopicOptions: SelectOption[];
  onSubmit: (values: QuestionFormValues) => void;
  onCancel?: () => void;
  initialValues?: QuestionFormValues;
  submitLabel?: string;
  isLoading?: boolean;
}

const defaultValues: QuestionFormValues = {
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correct_option: 'option1',
  explanation: '',
  difficulty: undefined,
  topic: '',
  sub_topic: '',
  media_url: '',
};

export function QuestionForm({
  topicOptions,
  subTopicOptions,
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = 'Add Question',
  isLoading = false,
}: QuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values);
    if (!initialValues) {
      reset(defaultValues);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <Textarea
        label="Question Text"
        placeholder="Enter the question"
        required
        error={errors.question?.message}
        {...register('question')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Option A"
          placeholder="Option 1"
          required
          error={errors.option1?.message}
          {...register('option1')}
        />
        <Input
          label="Option B"
          placeholder="Option 2"
          required
          error={errors.option2?.message}
          {...register('option2')}
        />
        <Input
          label="Option C"
          placeholder="Option 3"
          required
          error={errors.option3?.message}
          {...register('option3')}
        />
        <Input
          label="Option D"
          placeholder="Option 4"
          required
          error={errors.option4?.message}
          {...register('option4')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="correct_option"
          control={control}
          render={({ field }) => (
            <Select
              label="Correct Answer"
              required
              options={CORRECT_OPTION_VALUES.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.correct_option?.message}
            />
          )}
        />

        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <Select
              label="Difficulty (Optional)"
              options={[
                { value: '', label: 'Select difficulty' },
                ...DIFFICULTY_LEVELS.map((d) => ({ value: d.value, label: d.label })),
              ]}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? undefined : e.target.value)
              }
            />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="topic"
          control={control}
          render={({ field }) => (
            <Select
              label="Topic (Optional)"
              options={[{ value: '', label: 'Select topic' }, ...topicOptions]}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value || undefined)}
            />
          )}
        />

        <Controller
          name="sub_topic"
          control={control}
          render={({ field }) => (
            <Select
              label="Sub-topic (Optional)"
              options={[{ value: '', label: 'Select sub-topic' }, ...subTopicOptions]}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value || undefined)}
            />
          )}
        />
      </div>

      <Textarea
        label="Explanation (Optional)"
        placeholder="Explain the correct answer"
        {...register('explanation')}
      />

      <Input
        label="Media URL (Optional)"
        placeholder="https://example.com/image.png"
        error={errors.media_url?.message}
        {...register('media_url')}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          leftIcon={<Plus className="h-4 w-4" />}
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
