// 'use client';
// import { usePathname } from 'next/navigation';
// import AccessGate from '@/app/AccessGate';

// export default function ConditionalAccessGate({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
  
//   // Admin routes - NEVER protect with AccessGate (admin users need access regardless of fees)
//   const adminRoutes = ['/admin', '/AdminPannel', '/admin/', '/AdminPannel/'];
//   const isAdminRoute = adminRoutes.some(route => pathname?.startsWith(route));
  
//   // Routes that need protection (require authentication AND paid fees)
//   const protectedPaths = [
//     '/dashboard', '/profile', '/investments', '/withdrawals',
//     '/history', '/tasks', '/settings'
//   ];
  
//   const isProtected = protectedPaths.some(path => pathname?.startsWith(path));
  
//   // Public routes - no protection needed
//   const isPublic = ['/', '/login', '/register', '/apply'].includes(pathname || '');
  
//   // 🚫 EXCLUDE admin routes from AccessGate
//   if (isAdminRoute) {
//     console.log('Admin route detected - skipping AccessGate');
//     return <>{children}</>;
//   }
  
//   // Apply AccessGate only to protected non-admin routes
//   if (isProtected && !isPublic) {
//     return <AccessGate>{children}</AccessGate>;
//   }
  
//   // Render public routes normally
//   return <>{children}</>;
// }