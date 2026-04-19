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
} from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useLogout } from '@/libs/hooks/useLogout';

const menuItems = [
  { href: '/admin',                     label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/admin/users',               label: 'Users',             icon: Users },
  { href: '/admin/investments',         label: 'Investments',       icon: Briefcase },
  { href: '/admin/tasks',               label: 'Tasks',             icon: CheckSquare },
  { href: '/admin/transactions',        label: 'Transactions',      icon: CreditCard },
  { href: '/admin/challenges',          label: 'Challenges',        icon: Award },
  { href: '/admin/approvals',label: 'Approvals',         icon: TrendingUp },
  { href: '/admin/analytics',           label: 'Analytics',         icon: BarChart3 },
  { href: '/admin/activities',          label: 'Activities',        icon: Activity },
  { href: '/admin/notifications',       label: 'Notifications',     icon: Bell },
  { href: '/admin/settings',            label: 'Settings',          icon: Settings },
];

export function ModernSidebar() {
  const pathname  = usePathname();
  const { user }  = useAuthStore();
  const { handleLogout } = useLogout();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .sidebar-root {
          position: fixed;
          left: 0; top: 0;
          z-index: 30;
          height: 100vh;
          background: #111111;
          display: flex;
          flex-direction: column;
          transition: width 0.25s cubic-bezier(.4,0,.2,1);
          font-family: 'DM Sans', sans-serif;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .sidebar-logo-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          height: 58px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .sidebar-wordmark {
          font-family: 'DM Serif Display', serif;
          font-size: 17px;
          color: #ffffff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-wordmark span { color: #f97316; }

        .sidebar-collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          flex-shrink: 0;
          transition: color 0.15s, background 0.15s;
        }
        .sidebar-collapse-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-avatar {
          flex-shrink: 0;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        .sidebar-user-name {
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          font-size: 10.5px;
          color: rgba(255,255,255,0.35);
          text-transform: capitalize;
          white-space: nowrap;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          scrollbar-width: none;
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
          color: rgba(255,255,255,0.4);
          font-size: 12.5px;
          font-weight: 400;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
        }

        .nav-item.active {
          background: rgba(249,115,22,0.12);
          color: #f97316;
          font-weight: 500;
        }

        .nav-item.active .nav-dot {
          display: block;
        }

        .nav-dot {
          display: none;
          margin-left: auto;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
        }

        .nav-icon { flex-shrink: 0; }
        .nav-label { overflow: hidden; text-overflow: ellipsis; }

        .sidebar-footer {
          padding: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 8px;
          color: rgba(255,255,255,0.3);
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }

        .section-label {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 10px 10px 4px;
        }
      `}</style>

      <aside
        className="sidebar-root"
        style={{ width: collapsed ? '58px' : '220px' }}
      >
        {/* Logo */}
        <div className="sidebar-logo-area">
          {!collapsed && (
            <span className="sidebar-wordmark">
              AD<span>.</span>
            </span>
          )}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: collapsed ? 'auto' : undefined, marginRight: collapsed ? 'auto' : undefined }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p className="sidebar-user-name">{user?.username || 'Admin'}</p>
              <p className="sidebar-user-role">{user?.role || 'Administrator'}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {!collapsed && <p className="section-label">Menu</p>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={{ justifyContent: collapsed ? 'center' : undefined }}
              >
                <Icon size={15} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
                {!collapsed && <span className="nav-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            style={{ justifyContent: collapsed ? 'center' : undefined }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}