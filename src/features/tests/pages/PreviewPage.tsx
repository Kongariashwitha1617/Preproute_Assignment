import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Edit, FileText, ListChecks, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { TabGroup } from '@/components/ui/TabGroup';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { TEST_TYPES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/api/client';
import { formatDate, stripHtml } from '@/lib/utils/format';
import { computeScheduleExpiryIso } from '@/lib/utils/scheduleUtils';
import { useFetchBulkQuestions } from '@/hooks/useQuestions';
import { usePublishTest, useTest, useUpdateTest } from '@/hooks/useTests';
import { PublishTestDialog } from '../components/PublishTestDialog';

const LIVE_UNTIL_OPTIONS = [
  { value: 'always', label: 'Always Available' },
  { value: '1w', label: '1 Week' },
  { value: '2w', label: '2 Weeks' },
  { value: '3w', label: '3 Weeks' },
  { value: '1m', label: '1 Month' },
  { value: 'custom', label: 'Custom Duration' },
];

function getTypeLabel(type: string) {
  return TEST_TYPES.find((t) => t.value === type)?.label ?? type;
}

function getDifficultyLabel(difficulty: string) {
  if (difficulty === 'hard') return 'Difficult';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function canPublishTest(status: string | null | undefined): boolean {
  return !status || status === 'draft' || status === 'unpublished';
}

function getPageTitle(status: string | null | undefined): string {
  return canPublishTest(status) ? 'Preview & Publish' : 'Test Preview';
}

export function PreviewPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const { data: test, isLoading, isError, error } = useTest(testId);
  const questionIds = test?.questions ?? [];
  const { data: questions = [], isLoading: questionsLoading } =
    useFetchBulkQuestions(questionIds);

  const publishMutation = usePublishTest();
  const updateMutation = useUpdateTest();

  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [liveUntil, setLiveUntil] = useState('always');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const handlePublishNow = async () => {
    if (!testId) return;

    try {
      await publishMutation.mutateAsync(testId);
      setShowPublishDialog(false);
      navigate('/test-tracking');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirm = async () => {
    if (!testId) return;

    if (publishMode === 'now') {
      setShowPublishDialog(true);
      return;
    }

    try {
      if (!scheduleDate || !scheduleTime) {
        toast.error('Please select schedule date and time');
        return;
      }

      const scheduledIso = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      if (Number.isNaN(new Date(scheduledIso).getTime())) {
        toast.error('Invalid schedule date or time');
        return;
      }

      const expiryIso = computeScheduleExpiryIso(
        scheduledIso,
        liveUntil,
        endDate,
        endTime,
      );

      await updateMutation.mutateAsync({
        id: testId,
        payload: {
          status: 'scheduled',
          scheduled_date: scheduledIso,
          expiry_date: expiryIso,
        },
      });
      toast.success('Test scheduled successfully');
      navigate('/test-tracking');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading || questionsLoading) return <PageLoader />;
  if (isError || !test) {
    return (
      <div className="p-8">
        <ErrorState message={getErrorMessage(error)} />
      </div>
    );
  }

  const questionCount = questions.length || test.total_questions;
  const showPublishControls = canPublishTest(test.status);

  return (
    <>
      <main className="figma-page">
        <div className="mx-auto max-w-[920px]">
          <p className="mb-1 text-sm text-[#94A3B8]">
            {showPublishControls ? 'Test creation' : 'Test tracking'}
          </p>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-[#475569]">{getPageTitle(test.status)}</h1>
            <StatusBadge status={test.status} />
            {showPublishControls && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All {questionCount} Questions done
              </span>
            )}
          </div>

          <div className="figma-card mb-8 !p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className="rounded-full bg-navy px-4 py-1.5 text-xs font-medium text-white">
                {getTypeLabel(test.type)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tests/${testId}/questions`)}
                >
                  Edit Questions
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(`/tests/${testId}/edit`)}
                  className="rounded-md p-1.5 text-primary hover:bg-primary-50"
                  aria-label="Edit test"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{test.name}</h2>
              <span className="rounded-full bg-teal-badge/15 px-3 py-0.5 text-xs font-medium capitalize text-teal-badge">
                {getDifficultyLabel(test.difficulty)}
              </span>
            </div>

            <dl className="space-y-2 text-sm text-slate-600">
              <div>
                <span className="text-slate-500">Subject : </span>
                <span className="font-medium text-slate-800">{test.subject}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500">Topic :</span>
                {test.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-amber-badge px-2.5 py-0.5 text-xs font-medium text-amber-text"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              {test.sub_topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">Sub Topic :</span>
                  {test.sub_topics.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full bg-amber-badge px-2.5 py-0.5 text-xs font-medium text-amber-text"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-0 overflow-hidden rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#64748B]">
              <span className="flex flex-1 items-center justify-center gap-2 border-r border-[#E2E8F0] px-4 py-3">
                <Clock className="h-4 w-4 text-slate-400" />
                {test.total_time} Min
              </span>
              <span className="flex flex-1 items-center justify-center gap-2 border-r border-[#E2E8F0] px-4 py-3">
                <FileText className="h-4 w-4 text-[#94A3B8]" />
                {questionCount} Q&apos;s
              </span>
              <span className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                <Trophy className="h-4 w-4 text-[#94A3B8]" />
                {test.total_marks} Marks
              </span>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="mb-2 font-semibold text-slate-800">Marking Scheme</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <p>
                  <span className="text-slate-500">Correct: </span>
                  <span className="font-medium text-emerald-700">+{test.correct_marks}</span>
                </p>
                <p>
                  <span className="text-slate-500">Wrong: </span>
                  <span className="font-medium text-red-600">{test.wrong_marks}</span>
                </p>
                <p>
                  <span className="text-slate-500">Unattempted: </span>
                  <span className="font-medium text-slate-700">{test.unattempt_marks}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="figma-card mb-8">
            <div className="mb-6 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-slate-800">
                Questions ({questions.length})
              </h2>
            </div>

            {questions.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No questions found. Add questions before publishing.
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const options = [
                    { key: 'option1', label: 'A', value: question.option1 },
                    { key: 'option2', label: 'B', value: question.option2 },
                    { key: 'option3', label: 'C', value: question.option3 },
                    { key: 'option4', label: 'D', value: question.option4 },
                  ] as const;

                  return (
                    <div
                      key={question.id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Badge variant="info">Q{index + 1}</Badge>
                        {question.difficulty && (
                          <Badge variant="default">{question.difficulty}</Badge>
                        )}
                      </div>
                      <p className="font-medium text-slate-900">
                        {stripHtml(question.question)}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {options.map((option) => {
                          const isCorrect = question.correct_option === option.key;
                          return (
                            <p
                              key={option.key}
                              className={`rounded-md px-3 py-2 text-sm ${
                                isCorrect
                                  ? 'border border-emerald-200 bg-emerald-50 font-medium text-emerald-800'
                                  : 'text-slate-600'
                              }`}
                            >
                              <span className="font-medium">{option.label}:</span> {option.value}
                              {isCorrect && (
                                <span className="ml-2 text-xs text-emerald-600">(Correct)</span>
                              )}
                            </p>
                          );
                        })}
                      </div>
                      {question.explanation && (
                        <p className="mt-3 text-xs text-slate-500">
                          Explanation: {question.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {!showPublishControls && (
            <div className="figma-card mb-8 !p-6">
              {test.status === 'scheduled' && (
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">
                    This test is scheduled and will go live automatically.
                  </p>
                  <p>
                    <span className="text-slate-500">Goes live: </span>
                    <span className="font-medium text-slate-800">
                      {formatDate(test.scheduled_date)}
                    </span>
                  </p>
                  {test.expiry_date && (
                    <p>
                      <span className="text-slate-500">Available until: </span>
                      <span className="font-medium text-slate-800">
                        {formatDate(test.expiry_date)}
                      </span>
                    </p>
                  )}
                  <p className="text-slate-500">
                    No further action is needed. Use Edit if you want to change test details.
                  </p>
                </div>
              )}

              {test.status === 'live' && (
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-emerald-800">
                    This test is live and available on the platform.
                  </p>
                  <p className="text-slate-500">
                    Publishing is complete. You can review questions or edit the test below.
                  </p>
                </div>
              )}

              {test.status !== 'scheduled' && test.status !== 'live' && (
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">
                    This test cannot be published from here.
                  </p>
                  <p className="text-slate-500">
                    Current status: <StatusBadge status={test.status} />
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            {showPublishControls ? (
              <>
                <TabGroup
                  options={[
                    { value: 'now', label: 'Publish Now' },
                    { value: 'schedule', label: 'Schedule Publish' },
                  ]}
                  value={publishMode}
                  onChange={(v) => setPublishMode(v as 'now' | 'schedule')}
                  className="mb-8"
                />

                {publishMode === 'schedule' && (
                  <>
                    <p className="mb-4 text-sm font-semibold text-slate-800">Select Date and Time</p>
                    <div className="mb-8 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Select Date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                      <Input
                        label="Select Time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>

                    <p className="mb-2 text-sm font-semibold text-slate-800">Live Until</p>
                    <p className="mb-4 text-sm text-slate-500">
                      Choose how long this test should remain available on the platform.
                    </p>

                    <RadioGroup
                      name="liveUntil"
                      options={LIVE_UNTIL_OPTIONS}
                      value={liveUntil}
                      onChange={setLiveUntil}
                      orientation="grid"
                      className="mb-6"
                    />

                    {liveUntil === 'custom' && (
                      <div className="mb-6 grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Select End Date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Input
                          label="Select End Time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-4">
                  <Button
                    variant="cancel"
                    className="min-w-[110px]"
                    onClick={() => navigate('/test-tracking')}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="min-w-[130px]"
                    isLoading={publishMutation.isPending || updateMutation.isPending}
                    onClick={() => void handleConfirm()}
                  >
                    {publishMode === 'now' ? 'Publish Test' : 'Confirm Schedule'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  className="min-w-[160px]"
                  onClick={() => navigate('/test-tracking')}
                >
                  Back to Test Tracking
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublishTestDialog
        isOpen={showPublishDialog}
        testName={test.name}
        isLoading={publishMutation.isPending}
        onClose={() => setShowPublishDialog(false)}
        onConfirm={() => void handlePublishNow()}
      />
    </>
  );
}
