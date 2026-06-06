export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent?.trim() ?? html;
}
