// src/components/admin/ModernSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  CreditCard,
  Award,
  BarChart3,
  Activity,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useLogout } from '@/libs/hooks/useLogout';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-orange-500' },
  { href: '/admin/users', label: 'Users', icon: Users, color: 'text-blue-500' },
  { href: '/admin/investments', label: 'Investments', icon: Briefcase, color: 'text-green-500' },
  { href: '/admin/tasks', label: 'Tasks', icon: CheckSquare, color: 'text-purple-500' },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard, color: 'text-yellow-500' },
  { href: '/admin/challenges', label: 'Challenges', icon: Award, color: 'text-red-500' },
  { href: '/admin/investment-approvals', label: 'Invest Approvals', icon: TrendingUp, color: 'text-emerald-500' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-500' },
  { href: '/admin/activities', label: 'Activities', icon: Activity, color: 'text-pink-500' },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'text-gray-500' },
];

export function ModernSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl`}>
        
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AD Admin</h1>
                <p className="text-xs text-gray-400">Investment Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex w-full items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1 text-gray-400 hover:bg-gray-700 hover:text-white lg:block"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* User Info */}
        <div className={`border-b border-gray-700 p-4 ${collapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
              <span className="text-sm font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-medium text-white">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
            )}
          </div>
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 ${!isActive ? item.color : 'text-white'}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-gray-700 p-4 ${collapsed ? 'text-center' : ''}`}>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-gray-300 transition-all hover:bg-red-600 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}