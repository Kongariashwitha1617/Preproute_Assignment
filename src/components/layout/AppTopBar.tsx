import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

interface AppTopBarProps {
  onMenuClick?: () => void;
}

export function AppTopBar({ onMenuClick }: AppTopBarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center justify-end border-b border-[#E2E8F0] bg-white px-5 sm:px-8">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-auto rounded-[6px] p-2 text-[#64748B] hover:bg-[#F8FAFC] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px] stroke-[1.75]" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-[6px] py-1 pl-1 pr-1 transition-colors hover:bg-[#F8FAFC] sm:gap-3 sm:pr-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FB923C] text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-[#1E293B]">
                {user?.name ?? 'User'}
              </p>
              <p className="text-xs capitalize text-[#94A3B8]">{user?.role ?? 'Admin'}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#94A3B8] sm:block" />
          </button>
          <div className="invisible absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-[6px] border border-[#E2E8F0] bg-white py-1 opacity-0 shadow-modal transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <button
              type="button"
              onClick={logout}
              className="w-full px-4 py-2.5 text-left text-sm text-[#475569] hover:bg-[#F8FAFC]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
