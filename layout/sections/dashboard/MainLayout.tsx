// // src/components/layout/MainLayout.tsx
// 'use client';

// import { useState } from 'react';
// import { Sidebar } from './Sidebar';
// import { Header } from './Header';
// import AccessGate from '@/AccessGate';

// export function MainLayout({ children }: { children: React.ReactNode }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//  <AccessGate>
//       {/* Sidebar */}
//       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

//       {/* Header */}
//       <Header onMenuClick={() => setIsOpen(true)} />

//       {/* Content */}
//       <main className="mt-16 md:ml-64 p-4 md:p-8">
        
//         {children}
//       </main>
//       </AccessGate>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import AccessGate from '@/layout/AccessGate';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccessGate>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <Header onMenuClick={() => setIsOpen(true)} />

        <main className="mt-16 md:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>
    </AccessGate>
  );
}