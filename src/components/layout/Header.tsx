import { Menu, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCreateButton?: boolean;
  onMenuClick?: () => void;
}

export function Header({
  title,
  subtitle,
  showCreateButton = false,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {showCreateButton && (
          <Link to="/tests/create">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Create New Test</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
