
// // 'use client';

// // import { useEffect } from 'react';
// // import Link from 'next/link';
// // import {
// //   Loader2,
// //   DollarSign,
// //   TrendingUp,
// //   CheckCircle,
// //   Clock,
// //   LucideIcon
// // } from 'lucide-react';

// // import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
// // import { Card } from '@/layout/components/Card';
// // import { Button } from '@/layout/components/Button';

// // import { useAuthStore } from '@/libs/stores/auth.store';
// // import { useInvestmentStore } from '@/libs/stores/investment.store';
// // import { useTaskStore } from '@/libs/stores/task.store';

// // import { formatCurrency, formatDate } from '@/libs/utils/format';

// // export default function DashboardPage() {
// //   const { user } = useAuthStore();
// //   const { investments, fetchInvestments, isLoading: investmentsLoading } = useInvestmentStore();
// //   const { myTasks, fetchMyTasks, isLoading: tasksLoading } = useTaskStore();

// //   useEffect(() => {
// //     fetchInvestments();
// //     fetchMyTasks();
// //   }, [fetchInvestments, fetchMyTasks]);

// //   if (investmentsLoading || tasksLoading) {
// //     return (
// //       <MainLayout>
// //         <div className="flex items-center justify-center h-screen">
// //           <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
// //         </div>
// //       </MainLayout>
// //     );
// //   }

// //   const investmentsArray = Array.isArray(investments) ? investments : [];
// //   const myTasksArray = Array.isArray(myTasks) ? myTasks : [];

// //   const totalInvested = investmentsArray.reduce((sum, i) => sum + (i.amount || 0), 0);
// //   const totalProfit = investmentsArray.reduce((sum, i) => sum + (i.total_profit || 0), 0);
// //   const completedTasks = myTasksArray.filter(t => t.status === 'completed').length;
// //   const pendingTasks = myTasksArray.filter(t => t.status !== 'completed').length;

// //   const recentTasks = myTasksArray.slice(0, 3);

// //   return (
// //     <MainLayout>
// //       <div className="space-y-6">

// //         {/* HERO */}
// //         <div className="rounded-2xl bg-gradient-to-br from-black via-gray-900 to-orange-900 p-6 text-white">
// //           <h1 className="text-2xl font-bold">
// //             Welcome back, {user?.username || 'Challenger'}
// //           </h1>
// //           <p className="text-sm text-gray-300 mt-1">
// //             Push your limits. Earn bigger rewards.
// //           </p>

// //           <div className="flex gap-3 mt-5">
// //             <Link href="/tasks">
// //               <Button className="bg-orange-500 hover:bg-orange-600 text-white">
// //                 Start Challenge
// //               </Button>
// //             </Link>
// //             <Link href="/tasks">
// //               <Button variant="outline" className="border-white text-white">
// //                 View Challenges
// //               </Button>
// //             </Link>
// //           </div>
// //         </div>

// //         {/* STATS */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <StatCard title="Invested" value={formatCurrency(totalInvested)} icon={DollarSign} />
// //           <StatCard title="Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} />
// //           <StatCard title="Completed" value={completedTasks} icon={CheckCircle} />
// //           <StatCard title="Pending" value={pendingTasks} icon={Clock} />
// //         </div>

// //         {/* TASKS */}
// //         <Card className="p-5 rounded-2xl">
// //           <div className="flex justify-between mb-4">
// //             <h2 className="font-semibold text-lg">Active Challenges</h2>
// //             <Link href="/tasks">
// //               <Button size="sm" variant="outline">View All</Button>
// //             </Link>
// //           </div>

// //           <div className="space-y-3">
// //             {recentTasks.length > 0 ? (
// //               recentTasks.map((task) => (
// //                 <div
// //                   key={task.id}
// //                   className="flex justify-between items-center p-3 rounded-xl border hover:border-orange-300"
// //                 >
// //                   <div>
// //                     <p className="font-medium">{task.task_title}</p>
// //                     <p className="text-xs text-gray-500">
// //                       {formatDate(task.started_at)}
// //                     </p>
// //                   </div>

// //                   <div className="text-right">
// //                     <p className="text-orange-500 font-bold">
// //                       +{formatCurrency(task.task_reward || 0)}
// //                     </p>
// //                     <span className="text-xs text-gray-500">
// //                       {task.status}
// //                     </span>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-gray-500 text-center py-6">
// //                 No active challenges
// //               </p>
// //             )}
// //           </div>
// //         </Card>

// //       </div>
// //     </MainLayout>
// //   );
// // }


// // type StatCardProps = {
// //   title: string;
// //   value: string | number;
// //   icon: LucideIcon;
// // };

// // function StatCard({ title, value, icon: Icon }: StatCardProps) {
// //   return (
// //     <div className="rounded-2xl p-4 bg-white border hover:border-orange-300">
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <p className="text-xs text-gray-500">{title}</p>
// //           <p className="text-lg font-bold text-gray-900">{value}</p>
// //         </div>

// //         <div className="bg-orange-100 p-2 rounded-lg">
// //           <Icon className="h-5 w-5 text-orange-500" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useEffect } from 'react';
// import { Loader2 } from 'lucide-react';

// import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
// import DashboardContent from './DashboardContent';

// import { useAuthStore } from '@/libs/stores/auth.store';
// import { useInvestmentStore } from '@/libs/stores/investment.store';
// import { useTaskStore } from '@/libs/stores/task.store';

// export default function DashboardPage() {
//   const { user } = useAuthStore();
//   const { investments, fetchInvestments, isLoading: invLoading } = useInvestmentStore();
//   const { myTasks, fetchMyTasks, isLoading: taskLoading } = useTaskStore();

//   useEffect(() => {
//     fetchInvestments();
//     fetchMyTasks();
//   }, []);

//   if (invLoading || taskLoading) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center h-screen">
//           <Loader2 className="animate-spin text-orange-500" />
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <DashboardContent
//         user={user}
//         investments={Array.isArray(investments) ? investments : []}
//         myTasks={Array.isArray(myTasks) ? myTasks : []}
//       />
//     </MainLayout>
//   );
// }

'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import DashboardContent from './DashboardContent';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { investments, fetchInvestments, isLoading: invLoading } = useInvestmentStore();
  const { myTasks, fetchMyTasks, isLoading: taskLoading } = useTaskStore();

  useEffect(() => {
    fetchInvestments();
    fetchMyTasks();
  }, []);

  if (invLoading || taskLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
            <p className="text-sm text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardContent
        user={user}
        investments={Array.isArray(investments) ? investments : []}
        myTasks={Array.isArray(myTasks) ? myTasks : []}
      />
    </MainLayout>
  );
}