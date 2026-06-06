import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatusBadge } from '@/components/ui/Badge';
import { getErrorMessage } from '@/lib/api/client';
import { resolveIdToName, resolveSubjectId, resolveToIds } from '@/lib/utils/resolveIds';
import { useSubjects, useTopics, useMultiSubTopics } from '@/hooks/useSubjects';
import {
  useBulkCreateQuestions,
  useDeleteQuestion,
  useFetchBulkQuestions,
  useUpdateQuestion,
} from '@/hooks/useQuestions';
import { useTest, useUpdateTest } from '@/hooks/useTests';
import { useQuestionDraftStore } from '@/stores/questionDraftStore';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';
import type { QuestionFormValues } from '../schemas/questionSchema';
import type { LocalQuestion } from '@/types/question';


function generateLocalId(): string {
  return `local-${crypto.randomUUID()}`;
}

export function QuestionsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const { data: test, isLoading, isError, error } = useTest(testId);
  const { data: subjects = [] } = useSubjects();
  const bulkCreateMutation = useBulkCreateQuestions();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();
  const updateTestMutation = useUpdateTest();

  const questions = useQuestionDraftStore((state) => state.questions);
  const setQuestions = useQuestionDraftStore((state) => state.setQuestions);
  const clearQuestions = useQuestionDraftStore((state) => state.clearQuestions);
  const addQuestion = useQuestionDraftStore((state) => state.addQuestion);
  const updateQuestionLocal = useQuestionDraftStore((state) => state.updateQuestion);
  const removeQuestion = useQuestionDraftStore((state) => state.removeQuestion);

  const [editingQuestion, setEditingQuestion] = useState<LocalQuestion | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const questionIds = test?.questions ?? [];
  const { data: existingQuestions } = useFetchBulkQuestions(questionIds);

  const subjectId = useMemo(() => {
    if (!test) return '';
    return resolveSubjectId(test.subject, subjects);
  }, [test, subjects]);

  const { data: topics = [] } = useTopics(subjectId || undefined);

  const resolvedTopicIds = useMemo(() => {
    if (!test) return [];
    return resolveToIds(test.topics, topics);
  }, [test, topics]);

  const { data: subTopics = [] } = useMultiSubTopics(resolvedTopicIds);

  const topicOptions = useMemo(() => {
    const ids = resolvedTopicIds;
    return topics
      .filter((t) => ids.includes(t.id))
      .map((t) => ({ value: t.name, label: t.name }));
  }, [topics, resolvedTopicIds]);

  const subTopicOptions = subTopics.map((st) => ({
    value: st.name,
    label: st.name,
  }));

  const toQuestionApiFields = (question: LocalQuestion) => ({
    topic: resolveIdToName(question.topic, topics),
    sub_topic: resolveIdToName(question.sub_topic, subTopics),
  });

  useEffect(() => {
    clearQuestions();
  }, [testId, clearQuestions]);

  useEffect(() => {
    if (!existingQuestions || existingQuestions.length === 0) return;
    if (questions.length > 0) return;

    const mapped: LocalQuestion[] = existingQuestions.map((q) => ({
      localId: generateLocalId(),
      serverId: q.id,
      type: q.type,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correct_option: q.correct_option,
      explanation: q.explanation ?? undefined,
      difficulty: q.difficulty ?? undefined,
      topic: q.topic ?? undefined,
      sub_topic: q.sub_topic ?? undefined,
      media_url: q.media_url ?? undefined,
      test_id: testId!,
      subject: subjectId,
    }));

    setQuestions(mapped);
  }, [existingQuestions, questions.length, setQuestions, testId, subjectId]);

  const handleAddQuestion = (values: QuestionFormValues) => {
    if (!testId || !subjectId) return;

    const newQuestion: LocalQuestion = {
      localId: generateLocalId(),
      type: 'mcq',
      test_id: testId,
      subject: subjectId,
      ...values,
      topic: resolveIdToName(values.topic, topics) ?? values.topic,
      sub_topic: resolveIdToName(values.sub_topic, subTopics) ?? values.sub_topic,
      media_url: values.media_url || undefined,
    };

    addQuestion(newQuestion);
    toast.success('Question added');
  };

  const handleEditQuestion = (values: QuestionFormValues) => {
    if (!editingQuestion) return;

    const updated: LocalQuestion = {
      ...editingQuestion,
      ...values,
      topic: resolveIdToName(values.topic, topics) ?? values.topic,
      sub_topic: resolveIdToName(values.sub_topic, subTopics) ?? values.sub_topic,
      media_url: values.media_url || undefined,
    };

    updateQuestionLocal(editingQuestion.localId, updated);
    setEditingQuestion(null);
    toast.success('Question updated locally');
  };

  const handleDeleteQuestion = async (localId: string) => {
    const question = questions.find((q) => q.localId === localId);
    if (!question) return;

    if (question.serverId) {
      await deleteQuestionMutation.mutateAsync(question.serverId);
    }

    removeQuestion(localId);
  };

  const handleSaveAndContinue = async () => {
    if (!testId || !subjectId) return;

    if (questions.length < 1) {
      toast.error('At least one question is required');
      return;
    }

    setIsSaving(true);

    try {
      const newQuestions = questions.filter((q) => !q.serverId);
      const updatedQuestions = questions.filter((q) => q.serverId);

      for (const question of updatedQuestions) {
        if (!question.serverId) continue;
        const { topic, sub_topic } = toQuestionApiFields(question);
        await updateQuestionMutation.mutateAsync({
          id: question.serverId,
          payload: {
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            correct_option: question.correct_option,
            explanation: question.explanation,
            difficulty: question.difficulty,
            topic,
            sub_topic,
            media_url: question.media_url,
          },
          suppressToast: true,
        });
      }

      let createdIds: string[] = [];

      if (newQuestions.length > 0) {
        const created = await bulkCreateMutation.mutateAsync({
          payload: {
            questions: newQuestions.map((q) => {
              const { topic, sub_topic } = toQuestionApiFields(q);
              return {
                type: q.type,
                question: q.question,
                option1: q.option1,
                option2: q.option2,
                option3: q.option3,
                option4: q.option4,
                correct_option: q.correct_option,
                explanation: q.explanation,
                difficulty: q.difficulty,
                topic,
                sub_topic,
                media_url: q.media_url,
                test_id: testId,
                subject: subjectId,
              };
            }),
          },
          suppressToast: true,
        });
        createdIds = created.map((q) => q.id);
      }

      const allQuestionIds = [
        ...updatedQuestions.map((q) => q.serverId!).filter(Boolean),
        ...createdIds,
      ];

      await updateTestMutation.mutateAsync({
        id: testId,
        payload: {
          questions: allQuestionIds,
          total_questions: allQuestionIds.length,
          total_marks: allQuestionIds.length * (test?.correct_marks ?? 1),
        },
        suppressToast: true,
      });

      toast.success('Questions saved successfully');
      navigate(`/tests/${testId}/preview`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (isError || !test) {
    return (
      <div className="p-8">
        <ErrorState message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <main className="figma-page">
      <div className="mx-auto max-w-6xl space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Test Creation' },
            { label: 'Question creation' },
            { label: test.name },
          ]}
        />

        <div className="rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>
              <span className="text-slate-500">Subject:</span>{' '}
              <span className="font-medium text-slate-900">{test.subject}</span>
            </div>
            <div>
              <span className="text-slate-500">Type:</span>{' '}
              <span className="font-medium text-slate-900">{test.type}</span>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>{' '}
              <StatusBadge status={test.status} />
            </div>
            <div>
              <span className="text-slate-500">Questions:</span>{' '}
              <span className="font-medium text-slate-900">{questions.length}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="figma-card">
            <h2 className="mb-1 text-base font-semibold text-slate-800">
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              {editingQuestion
                ? 'Update the question details below'
                : 'Fill in the question details and options'}
            </p>
            <QuestionForm
              key={editingQuestion?.localId ?? 'new'}
              topicOptions={topicOptions}
              subTopicOptions={subTopicOptions}
              onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
              onCancel={editingQuestion ? () => setEditingQuestion(null) : undefined}
              initialValues={
                editingQuestion
                  ? {
                      question: editingQuestion.question,
                      option1: editingQuestion.option1,
                      option2: editingQuestion.option2,
                      option3: editingQuestion.option3,
                      option4: editingQuestion.option4,
                      correct_option: editingQuestion.correct_option,
                      explanation: editingQuestion.explanation,
                      difficulty: editingQuestion.difficulty,
                      topic: editingQuestion.topic,
                      sub_topic: editingQuestion.sub_topic,
                      media_url: editingQuestion.media_url ?? '',
                    }
                  : undefined
              }
              submitLabel={editingQuestion ? 'Update Question' : 'Add Another Question'}
            />
          </div>

          <div className="figma-card">
            <h2 className="mb-1 text-base font-semibold text-slate-800">Question List</h2>
            <p className="mb-6 text-sm text-slate-500">{questions.length} question(s) added</p>
            <QuestionList
              questions={questions}
              onEdit={setEditingQuestion}
              onDelete={(localId) => void handleDeleteQuestion(localId)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            rightIcon={<ArrowRight className="h-4 w-4" />}
            isLoading={isSaving}
            onClick={() => void handleSaveAndContinue()}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </main>
  );
}
