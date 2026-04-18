// src/components/admin/ModernHeader.tsx
'use client';

import { useState } from 'react';
import { Bell, Search, Menu, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useLogout } from '@/libs/hooks/useLogout';

export function ModernHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const notifications = [
    { id: 1, title: 'New user registered',        time: '5 min ago',   read: false },
    { id: 2, title: 'Investment request pending', time: '1 hour ago',  read: false },
    { id: 3, title: 'Task completed',             time: '2 hours ago', read: true  },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .header-root {
          position: fixed;
          right: 0; top: 0;
          z-index: 20;
          left: 220px;
          height: 58px;
          background: #ffffff;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-family: 'DM Sans', sans-serif;
          transition: left 0.25s cubic-bezier(.4,0,.2,1);
        }

        .header-search-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f7f7f7;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 7px 12px;
          width: 240px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .header-search-wrapper:focus-within {
          border-color: rgba(0,0,0,0.2);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
          background: #fff;
        }

        .header-search-input {
          background: none;
          border: none;
          outline: none;
          font-size: 12.5px;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
        }

        .header-search-input::placeholder { color: #c0c0c0; }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 8px;
          color: #888;
          position: relative;
          transition: background 0.15s, color 0.15s;
        }
        .icon-btn:hover { background: rgba(0,0,0,0.04); color: #1a1a1a; }

        .notif-badge {
          position: absolute;
          top: 6px; right: 6px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: 1.5px solid #fff;
        }

        .dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
          z-index: 100;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .notif-dropdown { width: 280px; }

        .dropdown-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-title {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.01em;
        }

        .notif-count {
          font-size: 10px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          border-radius: 20px;
          padding: 1px 7px;
          font-weight: 600;
        }

        .notif-item {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
          transition: background 0.12s;
        }
        .notif-item:hover { background: #fafafa; }
        .notif-item.unread { background: #fff8f4; }

        .notif-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .notif-title {
          font-size: 12px;
          color: #1a1a1a;
          font-weight: 450;
        }

        .notif-time {
          font-size: 10.5px;
          color: #b0b0b0;
          margin-top: 2px;
        }

        .dropdown-footer {
          padding: 10px 14px;
          text-align: center;
        }

        .dropdown-footer a {
          font-size: 11.5px;
          color: #f97316;
          text-decoration: none;
          font-weight: 500;
        }

        .user-menu-dropdown { width: 180px; }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 8px;
          transition: background 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .user-btn:hover { background: rgba(0,0,0,0.04); }

        .user-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 12px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .user-role {
          font-size: 10px;
          color: #999;
          text-transform: capitalize;
          text-align: left;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 9px 14px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #444;
          font-family: 'DM Sans', sans-serif;
          text-align: left;
          transition: background 0.12s;
        }
        .menu-item:hover { background: #fafafa; color: #1a1a1a; }

        .menu-item.danger { color: #e05252; }
        .menu-item.danger:hover { background: #fff5f5; }

        .menu-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 2px 0;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 5px;
          border-radius: 6px;
        }

        @media (max-width: 1024px) {
          .header-root { left: 0 !important; }
          .mobile-menu-btn { display: flex; align-items: center; }
          .header-search-wrapper { display: none; }
        }
      `}</style>

      <header className="header-root">
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <Menu size={18} />
          </button>

          <div className="header-search-wrapper">
            <Search size={13} color="#c0c0c0" />
            <input
              className="header-search-input"
              type="search"
              placeholder="Search..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Right */}
        <div className="header-actions">

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="notif-badge" />}
            </button>

            {showNotifications && (
              <div className="dropdown notif-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">Notifications</span>
                  {unreadCount > 0 && <span className="notif-count">{unreadCount} new</span>}
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item${!n.read ? ' unread' : ''}`}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!n.read && <span className="notif-dot" />}
                      <div>
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-time">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="dropdown-footer">
                  <a href="/admin/notifications">View all</a>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="user-btn"
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            >
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="user-name">{user?.username || 'Admin'}</p>
                <p className="user-role">{user?.role || 'Administrator'}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="dropdown user-menu-dropdown">
                <button className="menu-item"><User size={13} /> Profile</button>
                <button className="menu-item"><Settings size={13} /> Settings</button>
                <div className="menu-divider" />
                <button className="menu-item danger" onClick={handleLogout}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}