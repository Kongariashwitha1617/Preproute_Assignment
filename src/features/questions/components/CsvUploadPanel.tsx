import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { parseQuestionsCsv } from '@/lib/utils/csvParse';
import type { QuestionFormValues } from '../schemas/questionSchema';

interface CsvUploadPanelProps {
  onImport: (questions: QuestionFormValues[]) => void;
}

export function CsvUploadPanel({ onImport }: CsvUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a .csv file');
      return;
    }

    try {
      const text = await file.text();
      const { questions, errors } = parseQuestionsCsv(text);

      if (questions.length === 0) {
        toast.error(errors[0] ?? 'No valid questions found in CSV');
        return;
      }

      onImport(questions);

      if (errors.length > 0) {
        toast.warning(`Imported ${questions.length} question(s). ${errors.length} row(s) skipped.`);
      } else {
        toast.success(`Imported ${questions.length} question(s) from CSV`);
      }
    } catch {
      toast.error('Failed to read CSV file');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-[6px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Upload questions via CSV</p>
          <p className="mt-1 text-xs text-slate-500">
            Columns: question, option1–4, correct_option (A/B/C/D or option1–4), optional
            explanation, difficulty, topic, sub_topic, media_url
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/questions-template.csv" download>
            <Button type="button" variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Download template
            </Button>
          </a>
          <Button
            type="button"
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => inputRef.current?.click()}
          >
            Upload CSV
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
