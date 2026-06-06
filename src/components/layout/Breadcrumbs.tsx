interface BreadcrumbItem {
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-[13px] text-[#94A3B8] ${className}`}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 && <span className="mx-2 font-normal">/</span>}
          <span className={index === items.length - 1 ? 'text-[#64748B]' : ''}>
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
