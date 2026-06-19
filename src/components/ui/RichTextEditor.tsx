import { useCallback, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const TOOLBAR_ACTIONS = [
  { command: 'bold', icon: Bold, label: 'Bold' },
  { command: 'italic', icon: Italic, label: 'Italic' },
  { command: 'underline', icon: Underline, label: 'Underline' },
  { command: 'insertUnorderedList', icon: List, label: 'Bullet list' },
  { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
] as const;

export function RichTextEditor({
  label,
  value,
  onChange,
  error,
  required,
  placeholder = 'Enter the question',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || el.innerHTML === value) return;
    el.innerHTML = value || '';
  }, [value]);

  const syncValue = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    const isEmpty = !editorRef.current?.textContent?.trim();
    onChange(isEmpty ? '' : html);
  }, [onChange]);

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncValue();
  };

  return (
    <div>
      {label && (
        <label className="figma-label">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={cn(
          'overflow-hidden rounded-[6px] border bg-white',
          error ? 'border-red-400' : 'border-[#E2E8F0]',
        )}
      >
        <div className="flex flex-wrap gap-1 border-b border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1.5">
          {TOOLBAR_ACTIONS.map(({ command, icon: Icon, label: actionLabel }) => (
            <button
              key={command}
              type="button"
              title={actionLabel}
              aria-label={actionLabel}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(command);
              }}
              className="rounded p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={label ?? 'Question text'}
          data-placeholder={placeholder}
          onInput={syncValue}
          onBlur={syncValue}
          className="rich-text-editor min-h-[120px] px-3.5 py-3 text-sm text-[#334155] focus:outline-none"
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
