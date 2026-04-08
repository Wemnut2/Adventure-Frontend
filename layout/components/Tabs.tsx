// src/components/ui/Tabs.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 border-b border-gray-200">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={`px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
    value,
    children,
    className,
    ...props
  }: {
    value: string;
    children: ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');
  
    if (context.value !== value) return null;
  
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }