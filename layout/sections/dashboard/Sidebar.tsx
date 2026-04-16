
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  History,
  User,
  Settings,
  LogOut,
  CreditCard,
  Award,
  Users,
} from 'lucide-react';
import { Button } from '@/layout/components/Button';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useToast } from '@/libs/src/contexts/ToastContext';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/investments', label: 'Investments', icon: Briefcase },
  { href: '/tasks', label: 'Challenges', icon: CheckSquare },
  { href: '/withdrawals', label: 'Withdrawals', icon: CreditCard },
  { href: '/history', label: 'History', icon: History },
  // { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminMenuItems = [
  // { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Users },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/tasks', label: 'Manage Challenges', icon: CheckSquare },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/verifications', label: 'Verifications', icon: Award },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-800 p-6">
            <h1 className="text-xl font-bold text-orange-500">
              Adventure Challenge
            </h1>
            <p className="text-xs text-gray-400">Push Your Limits</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin */}
            {isAdmin && (
              <>
                <div className="my-4 h-px bg-gray-800" />
                <p className="px-4 text-xs text-gray-500 uppercase">Admin</p>

                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300 ${
                       isActive
  ? 'bg-orange-500/20 text-orange-400 border border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User */}
          <div className="border-t border-gray-800 p-4">
            <div className="mb-3">
              <p className="text-sm">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            <Button
              onClick={handleLogout}
              fullWidth
              className="bg-orange-500 hover:bg-orange-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}