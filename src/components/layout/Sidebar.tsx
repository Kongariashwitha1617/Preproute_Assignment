import { NavLink, useLocation } from 'react-router-dom';
import { ClipboardCheck, LayoutDashboard, PenLine } from 'lucide-react';
import { PrepRouteLogo } from '@/components/brand/PrepRouteLogo';
import { cn } from '@/lib/utils/cn';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === '/dashboard',
  },
  {
    to: '/tests/create',
    label: 'Test Creation',
    icon: PenLine,
    isActive: (pathname: string) => pathname.startsWith('/tests'),
  },
  {
    to: '/test-tracking',
    label: 'Test Tracking',
    icon: ClipboardCheck,
    isActive: (pathname: string) => pathname === '/test-tracking',
  },
];

function NavItem({
  to,
  label,
  icon: Icon,
  isActive,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  isActive: (pathname: string) => boolean;
}) {
  const { pathname } = useLocation();
  const active = isActive(pathname);

  return (
    <NavLink
      to={to}
      end={to === '/dashboard' && label === 'Dashboard'}
      className={() =>
        cn(
          'relative flex items-center gap-3 rounded-[6px] px-3.5 py-2.5 text-[13px] font-medium transition-colors',
          active
            ? 'bg-primary-50 text-primary'
            : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]',
        )
      }
    >
      {active && (
        <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r bg-primary" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white lg:flex">
      <div className="px-7 py-7">
        <PrepRouteLogo size="sm" />
      </div>

      <nav className="flex-1 space-y-0.5 px-4">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
}
