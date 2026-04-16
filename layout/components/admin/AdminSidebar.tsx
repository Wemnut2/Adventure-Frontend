// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  CreditCard,
  Award,
  Settings,
  BarChart3,
  Bell,
  Shield,
  Activity
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/investments', label: 'Investments', icon: Briefcase },
  { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/challenges', label: 'Challenges', icon: Award },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/activities', label: 'Activities', icon: Activity },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-64 bg-gray-900">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-800 p-6">
          <h1 className="text-2xl font-bold text-white">AD Admin</h1>
          <p className="text-sm text-gray-400">Investment Platform</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">Admin Access</p>
                <p className="text-xs text-gray-400">Full Control Panel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}