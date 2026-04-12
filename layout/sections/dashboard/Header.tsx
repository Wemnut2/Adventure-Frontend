'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { useActivities } from '@/libs/hooks/useAuth';

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { myTasks } = useTaskStore();
  const { activities, isLoading: activitiesLoading } = useActivities();

  // Close notif dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Search tasks locally
  const searchResults = searchQuery.trim().length > 1
    ? (Array.isArray(myTasks) ? myTasks : []).filter((t) =>
        t.task_title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const recentActivities = Array.isArray(activities) ? activities.slice(0, 8) : [];
  const unreadCount = recentActivities.length > 0 ? Math.min(recentActivities.length, 9) : 0;

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-20 bg-white border-b border-gray-100">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-3">

        {/* LEFT — hamburger + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 shrink-0"
          >
            <span className="text-lg">☰</span>
          </button>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery.length > 0 && setSearchOpen(true)}
                placeholder="Search challenges..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
                        onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.task_title}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {task.status?.replace('_', ' ')}
                          </p>
                        </div>
                        <StatusIcon status={task.status} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-400">No challenges found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — notifications */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900">Activity</h3>
                <span className="text-xs text-gray-400">{recentActivities.length} recent</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {activitiesLoading ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-400">Loading...</p>
                  </div>
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50">
                      <div className="mt-0.5 shrink-0">
                        <ActivityIcon action={activity.action} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">{activity.action}</p>
                        {activity.details && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{activity.details}</p>
                        )}
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  Showing your recent account activity
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

// ── Helpers ──────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
  if (status === 'in_progress') return <Clock className="w-4 h-4 text-blue-500 shrink-0" />;
  return <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />;
}

function ActivityIcon({ action }: { action: string }) {
  const a = action.toLowerCase();
  if (a.includes('login'))     return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (a.includes('task'))      return <CheckCircle className="w-4 h-4 text-orange-500" />;
  if (a.includes('invest'))    return <CheckCircle className="w-4 h-4 text-blue-500" />;
  if (a.includes('withdraw'))  return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  if (a.includes('profile'))   return <CheckCircle className="w-4 h-4 text-purple-500" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
}