// src/components/layout/Header.tsx
'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/layout/components/Input';

export function Header() {
  return (
    <header className="fixed right-0 top-0 left-64 z-10 bg-white shadow-md">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex-1">
          <div className="max-w-md">
            <Input
              type="search"
              placeholder="Search..."
              icon={<Search className="h-4 w-4 text-gray-400" />}
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
}