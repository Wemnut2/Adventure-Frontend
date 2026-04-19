// src/layout/sections/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, CheckSquare,
  Settings, LogOut, CreditCard, Award, Users,
} from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

const SIDEBAR_STYLES = `
  ${DASH_STYLES}

  .sb-root {
    position: fixed; top: 0; left: 0; z-index: 40;
    height: 100vh; width: 220px;
    background: #111; display: flex; flex-direction: column;
    transform: translateX(-100%); transition: transform .25s ease;
  }
  .sb-root.open, .sb-root.desktop { transform: translateX(0); }

  @media (min-width: 768px) { .sb-root { transform: translateX(0); } }

  .sb-overlay {
    position: fixed; inset: 0; z-index: 30;
    background: rgba(0,0,0,0.5); display: none;
  }
  .sb-overlay.show { display: block; }

  /* Logo */
  .sb-logo {
    padding: 18px 18px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .sb-logo-name {
    font-family: 'DM Serif Display', serif;
    font-size: 17px; color: #fff; letter-spacing: -0.01em;
  }
  .sb-logo-sub { font-size: 10.5px; color: #555; margin-top: 2px; }

  /* Nav */
  .sb-nav { flex: 1; overflow-y: auto; padding: 12px 10px; }

  .sb-section-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: #444; padding: 0 8px;
    margin: 14px 0 6px;
  }

  .sb-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 9px; margin-bottom: 2px;
    text-decoration: none; font-size: 12.5px; font-weight: 450;
    color: #777; transition: background .15s, color .15s;
    cursor: pointer; border: none; background: none; width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .sb-item:hover { background: rgba(255,255,255,0.05); color: #ccc; }
  .sb-item.active {
    background: rgba(249,115,22,0.12); color: #f97316;
  }
  .sb-item.logout:hover { background: rgba(239,68,68,0.08); color: #f87171; }

  .sb-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 10px 0; }

  /* User footer */
  .sb-footer {
    padding: 14px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .sb-user-name  { font-size: 12.5px; font-weight: 500; color: #ccc; margin-bottom: 2px; }
  .sb-user-email { font-size: 11px; color: #444; margin-bottom: 12px; }
`;

type Props = { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; };

const MENU = [
  { href: '/dashboard',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/dashboard/investments',  label: 'Investments',  icon: Briefcase       },
  { href: '/dashboard/tasks',        label: 'Challenges',   icon: CheckSquare     },
  { href: '/dashboard/withdrawals',  label: 'Withdrawals',  icon: CreditCard      },
  // { href: '/dashboard/history',      label: 'History',      icon: History         },
  { href: '/dashboard/settings',     label: 'Settings',     icon: Settings        },
];

const ADMIN_MENU = [
  { href: '/admin/users',         label: 'Manage Users',      icon: Users      },
  { href: '/admin/tasks',         label: 'Manage Challenges', icon: CheckSquare},
  { href: '/admin/transactions',  label: 'Transactions',      icon: CreditCard },
  { href: '/admin/verifications', label: 'Verifications',     icon: Award      },
];

export function Sidebar({ isOpen, setIsOpen }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast }    = useToast();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const handleLogout = async () => {
    try { await logout(); router.push('/login'); }
    catch { showToast('Logout failed', 'error'); }
  };

  return (
    <>
      <style>{SIDEBAR_STYLES}</style>

      {/* Mobile overlay */}
      <div className={`sb-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />

      <aside className={`sb-root ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sb-logo">
          <p className="sb-logo-name">Adventure.</p>
          <p className="sb-logo-sub">Push Your Limits</p>
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          {MENU.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                className={`sb-item ${active ? 'active' : ''}`}>
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="sb-divider" />
              <p className="sb-section-label">Admin</p>
              {ADMIN_MENU.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                    className={`sb-item ${active ? 'active' : ''}`}>
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="sb-footer">
          <p className="sb-user-name">{user?.username}</p>
          <p className="sb-user-email">{user?.email}</p>
          <button className="sb-item logout" style={{ width:'100%' }} onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}