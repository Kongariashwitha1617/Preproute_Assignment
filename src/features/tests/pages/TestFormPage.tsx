import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { PageLoader } from '@/components/ui/Loader';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Select } from '@/components/ui/Select';
import { TabGroup } from '@/components/ui/TabGroup';
import { ErrorState } from '@/components/ui/ErrorState';
import { DIFFICULTY_LEVELS, TEST_TYPES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/api/client';
import { resolveSubjectId, resolveToIds, isValidUuid } from '@/lib/utils/resolveIds';
import { useSubjects, useTopics, useMultiSubTopics } from '@/hooks/useSubjects';
import { useCreateTest, useTest, useUpdateTest } from '@/hooks/useTests';
import { testFormSchema, type TestFormValues } from '../schemas/testFormSchema';

function getTypeLabel(type: string) {
  return TEST_TYPES.find((t) => t.value === type)?.label ?? 'Chapter Wise';
}

export function TestFormPage() {
  const { testId } = useParams<{ testId: string }>();
  const isEdit = Boolean(testId);
  const navigate = useNavigate();
  const hydrationStep = useRef(0);

  const { data: existingTest, isLoading: testLoading, isError, error } = useTest(testId);
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const createMutation = useCreateTest();
  const updateMutation = useUpdateTest();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: '',
      subject: '',
      type: 'chapterwise',
      topics: [],
      sub_topics: [],
      difficulty: 'easy',
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 60,
      total_marks: 250,
      total_questions: 50,
    },
  });

  const selectedSubject = watch('subject');
  const selectedTopics = watch('topics');
  const selectedType = watch('type');

  const {
    data: topics = [],
    isLoading: topicsLoading,
    isError: topicsError,
  } = useTopics(selectedSubject || undefined);
  const {
    data: subTopics = [],
    isLoading: subTopicsLoading,
    isError: subTopicsError,
  } = useMultiSubTopics(selectedTopics);

  useEffect(() => {
    hydrationStep.current = 0;
  }, [testId]);

  useEffect(() => {
    if (!existingTest || !isEdit || subjects.length === 0 || hydrationStep.current > 0) return;

    const subjectId = resolveSubjectId(existingTest.subject, subjects);

    reset({
      name: existingTest.name,
      subject: subjectId,
      type: existingTest.type,
      topics: [],
      sub_topics: [],
      difficulty: existingTest.difficulty,
      correct_marks: existingTest.correct_marks,
      wrong_marks: existingTest.wrong_marks,
      unattempt_marks: existingTest.unattempt_marks,
      total_time: existingTest.total_time,
      total_marks: existingTest.total_marks,
      total_questions: existingTest.total_questions,
    });
    hydrationStep.current = 1;
  }, [existingTest, isEdit, subjects, reset]);

  useEffect(() => {
    if (!existingTest || !isEdit || hydrationStep.current !== 1) return;
    if (topicsLoading) return;
    if (existingTest.topics.length > 0 && topics.length === 0) return;

    const topicIds = resolveToIds(existingTest.topics, topics);
    if (existingTest.topics.length > 0 && topicIds.length === 0) return;

    setValue('topics', topicIds);
    hydrationStep.current = 2;
  }, [existingTest, isEdit, topics, topicsLoading, setValue]);

  useEffect(() => {
    if (!existingTest || !isEdit || hydrationStep.current !== 2) return;
    if (existingTest.sub_topics.length === 0) {
      hydrationStep.current = 3;
      return;
    }
    if (subTopicsLoading) return;
    if (selectedTopics.length === 0 || selectedTopics.some((id) => !isValidUuid(id))) return;

    const subTopicIds = resolveToIds(existingTest.sub_topics, subTopics);
    setValue('sub_topics', subTopicIds);
    hydrationStep.current = 3;
  }, [
    existingTest,
    isEdit,
    subTopics,
    subTopicsLoading,
    selectedTopics,
    setValue,
  ]);

  const subjectOptions = subjects.map((s) => ({ value: s.id, label: s.name }));
  const topicOptions = topics.map((t) => ({ value: t.id, label: t.name }));
  const subTopicOptions = subTopics.map((st) => ({ value: st.id, label: st.name }));

  const saveTest = async (values: TestFormValues, asDraft: boolean) => {
    if (isEdit && testId) {
      await updateMutation.mutateAsync({
        id: testId,
        payload: {
          ...values,
          ...(asDraft ? { status: 'draft' as const } : {}),
        },
      });
      return testId;
    }

    const created = await createMutation.mutateAsync({
      ...values,
      status: asDraft ? 'draft' : null,
    });
    return created.id;
  };

  const onNext = handleSubmit(async (values) => {
    const id = await saveTest(values, !isEdit);
    navigate(`/tests/${id}/questions`);
  });

  const onSaveDraft = handleSubmit(async (values) => {
    await saveTest(values, true);
    toast.success('Test saved as draft');
    navigate('/test-tracking');
  });

  if (isEdit && testLoading) return <PageLoader />;
  if (isEdit && isError) {
    return (
      <div className="p-8">
        <ErrorState message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <main className="figma-page">
      <div className="mx-auto max-w-[920px]">
        <Breadcrumbs
          items={[
            { label: 'Test Creation' },
            { label: isEdit ? 'Edit Test' : 'Create Test' },
            { label: getTypeLabel(selectedType) },
          ]}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TabGroup
              options={TEST_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              value={field.value}
              onChange={field.onChange}
              className="mb-8"
            />
          )}
        />

        <form className="space-y-8">
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  label="Subject"
                  placeholder="Choose from Drop-down"
                  required
                  options={subjectOptions}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue('topics', []);
                    setValue('sub_topics', []);
                  }}
                  disabled={subjectsLoading}
                  error={errors.subject?.message}
                />
              )}
            />

            <Input
              label="Name of Test"
              placeholder="Enter name of Test"
              required
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Topic"
                  required
                  options={topicOptions}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue('sub_topics', []);
                  }}
                  placeholder={selectedSubject ? 'Choose from Drop-down' : 'Select subject first'}
                  emptyMessage={
                    topicsError
                      ? 'Failed to load topics'
                      : selectedSubject && !topicsLoading
                        ? 'No topics available for this subject'
                        : 'No options available'
                  }
                  disabled={!selectedSubject}
                  isLoading={topicsLoading}
                  error={errors.topics?.message}
                />
              )}
            />

            <Controller
              name="sub_topics"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Sub Topic"
                  options={subTopicOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    selectedTopics.length > 0 ? 'Choose from Drop-down' : 'Select topic first'
                  }
                  emptyMessage={
                    subTopicsError
                      ? 'Failed to load sub-topics'
                      : selectedTopics.length > 0 && !subTopicsLoading
                        ? 'No sub-topics available for selected topics'
                        : 'No options available'
                  }
                  disabled={selectedTopics.length === 0}
                  isLoading={subTopicsLoading}
                />
              )}
            />
          </div>

          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            <Input
              label="Duration (Minutes)"
              type="number"
              placeholder="Enter the time"
              required
              error={errors.total_time?.message}
              {...register('total_time', { valueAsNumber: true })}
            />

            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Test Difficulty Level"
                  name="difficulty"
                  options={DIFFICULTY_LEVELS.map((d) => ({
                    value: d.value,
                    label: d.label,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.difficulty?.message}
                />
              )}
            />
          </div>

          <div>
            <p className="figma-section-title mb-4">Marking Scheme:</p>
            <div className="grid max-w-2xl gap-x-6 gap-y-4 sm:grid-cols-3">
              <Input
                label="Wrong Answer"
                type="number"
                required
                error={errors.wrong_marks?.message}
                {...register('wrong_marks', { valueAsNumber: true })}
              />
              <Input
                label="Unattempted"
                type="number"
                required
                error={errors.unattempt_marks?.message}
                {...register('unattempt_marks', { valueAsNumber: true })}
              />
              <Input
                label="Correct Answer"
                type="number"
                required
                error={errors.correct_marks?.message}
                {...register('correct_marks', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid max-w-2xl gap-x-8 gap-y-6 md:grid-cols-2">
            <Input
              label="No of Questions"
              type="number"
              placeholder="Ex:250 Marks"
              required
              error={errors.total_questions?.message}
              {...register('total_questions', { valueAsNumber: true })}
            />
            <Input
              label="Total Marks"
              type="number"
              placeholder="Ex:250 Marks"
              required
              error={errors.total_marks?.message}
              {...register('total_marks', { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
            <Button
              type="button"
              variant="cancel"
              size="md"
              className="min-w-[110px]"
              onClick={() => navigate('/test-tracking')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="min-w-[130px]"
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClick={onSaveDraft}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              size="md"
              className="min-w-[110px]"
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
