import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CORRECT_OPTION_VALUES } from '@/lib/constants';
import { stripHtml } from '@/lib/utils/format';
import type { LocalQuestion } from '@/types/question';

interface QuestionListProps {
  questions: LocalQuestion[];
  onEdit: (question: LocalQuestion) => void;
  onDelete: (localId: string) => void;
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">No questions added yet. Add at least one question.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const correctLabel = CORRECT_OPTION_VALUES.find(
          (o) => o.value === question.correct_option,
        )?.label;

        return (
          <div
            key={question.localId}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="info">Q{index + 1}</Badge>
                  {question.difficulty && (
                    <Badge variant="default">{question.difficulty}</Badge>
                  )}
                </div>
                <p className="font-medium text-slate-900">
                  {stripHtml(question.question)}
                </p>
                <div className="mt-3 grid gap-1 sm:grid-cols-2">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">A:</span> {question.option1}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">B:</span> {question.option2}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">C:</span> {question.option3}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">D:</span> {question.option4}
                  </p>
                </div>
                <p className="mt-2 text-xs text-emerald-600">
                  Correct: {correctLabel}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(question.localId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
