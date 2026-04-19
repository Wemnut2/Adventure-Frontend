// // src/app/(dashboard)/dashboard/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
// import DashboardContent from './DashboardContent';
// import { useAuthStore } from '@/libs/stores/auth.store';
// import { useInvestmentStore } from '@/libs/stores/investment.store';
// import { useTaskStore } from '@/libs/stores/task.store';
// import { Loader2 } from 'lucide-react';

// export default function DashboardPage() {
//   const { user, loadUser } = useAuthStore();
//   const { fetchUserInvestments, isLoading: invLoading } = useInvestmentStore();
//   const { fetchMyTasks, isLoading: taskLoading } = useTaskStore();

//   useEffect(() => {
//     const loadData = async () => {
//       await loadUser();
//       await Promise.all([
//         fetchUserInvestments(),
//         fetchMyTasks()
//       ]);
//     };
//     loadData();
//   }, []);

//   if (invLoading || taskLoading) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center h-[60vh]">
//           <div className="flex flex-col items-center gap-3">
//             <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
//             <p className="text-sm text-gray-500">Loading your dashboard...</p>
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <DashboardContent user={user} />
//     </MainLayout>
//   );
// }