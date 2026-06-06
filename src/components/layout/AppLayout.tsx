import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ClipboardCheck, LayoutDashboard, PenLine, X } from 'lucide-react';
import { PrepRouteLogo } from '@/components/brand/PrepRouteLogo';
import { cn } from '@/lib/utils/cn';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { AppTopBar } from './AppTopBar';
import { Sidebar } from './Sidebar';

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tests/create', label: 'Test Creation', icon: PenLine },
  { to: '/test-tracking', label: 'Test Tracking', icon: ClipboardCheck },
];

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <PrepRouteLogo size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-primary-50 text-primary'
                        : 'text-slate-600 hover:bg-slate-50',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-slate-200 p-4">
              <p className="mb-2 text-sm font-medium">{user?.name}</p>
              <button type="button" onClick={logout} className="text-sm text-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <Outlet context={{ openMobileMenu: () => setMobileMenuOpen(true) }} />
      </div>
    </div>
  );
}
