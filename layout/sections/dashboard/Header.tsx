// src/components/layout/Header.tsx
'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/layout/components/Input';

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-20 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* LEFT */}
        <div className="flex items-center gap-3 w-full">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>

          <div className="w-full max-w-md">
            <Input
              type="search"
              placeholder="Search..."
              icon={<Search className="h-4 w-4 text-gray-400" />}
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* RIGHT */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}