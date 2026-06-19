import { cn } from '@/lib/utils/cn';
import { sanitizeHtml, stripHtml } from '@/lib/utils/format';

interface QuestionContentProps {
  html: string;
  className?: string;
}

export function QuestionContent({ html, className }: QuestionContentProps) {
  const sanitized = sanitizeHtml(html);
  if (!stripHtml(sanitized).trim()) {
    return <p className={cn('text-slate-900', className)}>{html}</p>;
  }

  return (
    <div
      className={cn('rich-text-content font-medium text-slate-900', className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
