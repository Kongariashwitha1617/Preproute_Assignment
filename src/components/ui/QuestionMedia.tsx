interface QuestionMediaProps {
  url?: string | null;
  className?: string;
}

export function QuestionMedia({ url, className }: QuestionMediaProps) {
  if (!url?.trim()) return null;

  return (
    <div className={className}>
      <img
        src={url}
        alt="Question media"
        className="mt-3 max-h-48 max-w-full rounded-lg border border-slate-200 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
