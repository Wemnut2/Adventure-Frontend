// 'use client';

// import { useState, useEffect } from 'react';
// import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
// import { useTaskStore } from '@/libs/stores/task.store';
// import { useAuthStore } from '@/libs/stores/auth.store';
// import { formatCurrency } from '@/libs/utils/format';
// import { openWhatsApp } from '@/libs/utils/whatsapp';
// import {
//   Play, X, CheckCircle, Clock, AlertCircle,
//   Trophy, Medal, Award, ArrowRight, Lock
// } from 'lucide-react';

// // ── Tier config ───────────────────────────────────────────
// const TIERS = [
//   {
//     id: 'bronze',
//     name: 'Bronze',
//     multiplier: 1,
//     priceMultiplier: 1,
//     icon: Award,
//     color: 'from-amber-700 to-amber-500',
//     border: 'border-amber-300',
//     bg: 'bg-amber-50',
//     text: 'text-amber-700',
//     badge: 'bg-amber-100 text-amber-800',
//     description: 'Entry level — base reward',
//   },
//   {
//     id: 'silver',
//     name: 'Silver',
//     multiplier: 2,
//     priceMultiplier: 2,
//     icon: Medal,
//     color: 'from-gray-500 to-gray-400',
//     border: 'border-gray-300',
//     bg: 'bg-gray-50',
//     text: 'text-gray-700',
//     badge: 'bg-gray-200 text-gray-800',
//     description: '2× reward — intermediate',
//   },
//   {
//     id: 'gold',
//     name: 'Gold',
//     multiplier: 3,
//     priceMultiplier: 3,
//     icon: Trophy,
//     color: 'from-yellow-500 to-yellow-400',
//     border: 'border-yellow-400',
//     bg: 'bg-yellow-50',
//     text: 'text-yellow-700',
//     badge: 'bg-yellow-100 text-yellow-800',
//     description: '3× reward — maximum earnings',
//     recommended: true,
//   },
// ];

// type Task = {
//   id: number;
//   title: string;
//   description: string;
//   amount_to_pay: number;
//   reward_amount: number;
//   requires_subscription: boolean;
//   video_url?: string;
// };

// type UserTask = {
//   id: number;
//   task: number;
//   task_title: string;
//   task_description: string;
//   task_reward: number;
//   status: string;
//   started_at: string;
// };

// // ── Status helpers ────────────────────────────────────────
// const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
//   completed:   { label: 'Completed',           color: 'bg-green-100 text-green-700',  icon: CheckCircle  },
//   in_progress: { label: 'In Progress',         color: 'bg-blue-100 text-blue-700',    icon: Clock        },
//   pending:     { label: 'Pending Verification',color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle  },
//   failed:      { label: 'Failed',              color: 'bg-red-100 text-red-700',      icon: X            },
// };

// function StatusBadge({ status }: { status: string }) {
//   const cfg = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600', icon: Clock };
//   const Icon = cfg.icon;
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
//       <Icon className="w-3 h-3" />
//       {cfg.label}
//     </span>
//   );
// }

// // ── YouTube embed helper ──────────────────────────────────
// function getYouTubeEmbedUrl(url: string) {
//   const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
//   return match ? `https://www.youtube.com/embed/${match[1]}` : null;
// }

// // ── Main Page ─────────────────────────────────────────────
// export default function TasksPage() {
//   const { user } = useAuthStore();
//   const { availableTasks, myTasks, fetchAvailableTasks, fetchMyTasks } = useTaskStore();

//   const [activeTab, setActiveTab] = useState<'available' | 'my-tasks'>('available');
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [videoTask, setVideoTask] = useState<Task | null>(null);
//   const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
//   const [step, setStep] = useState<'detail' | 'tier'>('detail');

//   useEffect(() => {
//     fetchAvailableTasks();
//     fetchMyTasks();
//   }, []);

//   const handleTaskClick = (task: Task) => {
//     setSelectedTask(task);
//     setSelectedTier(null);
//     setStep('detail');
//   };

//   const handleProceed = () => {
//     if (!selectedTask || !selectedTier) return;
//     const price = (selectedTask.amount_to_pay * selectedTier.priceMultiplier).toFixed(2);
//     const reward = (selectedTask.reward_amount * selectedTier.multiplier).toFixed(2);
//     const message =
//       `Hello! I would like to participate in a task.\n\n` +
//       `📋 Task: ${selectedTask.title}\n` +
//       `🏅 Tier: ${selectedTier.name}\n` +
//       `💰 Payment: $${price}\n` +
//       `🎁 Expected Reward: $${reward}\n` +
//       `👤 Email: ${user?.email}\n` +
//       `👤 Username: ${user?.username}\n\n` +
//       `I have made the payment. Please verify and activate my task.`;
//     openWhatsApp(message);
//     setSelectedTask(null);
//     setSelectedTier(null);
//   };

//   const availableTasksArray = Array.isArray(availableTasks) ? availableTasks : [];
//   const myTasksArray = Array.isArray(myTasks) ? myTasks : [];

//   return (
//     <MainLayout>
//       <div className="space-y-6 pb-10">

//         {/* Page Header */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Pick a challenge, choose your tier, and earn rewards.
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
//           {(['available', 'my-tasks'] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 activeTab === tab
//                   ? 'bg-white text-gray-900 shadow-sm'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {tab === 'available' ? 'Available' : `My Tasks (${myTasksArray.length})`}
//             </button>
//           ))}
//         </div>

//         {/* Available Tasks */}
//         {activeTab === 'available' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {availableTasksArray.length > 0 ? availableTasksArray.map((task: Task) => (
//               <div
//                 key={task.id}
//                 className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all"
//               >
//                 {/* Video Thumbnail */}
//                 {task.video_url ? (
//                   <div
//                     className="relative h-44 bg-gray-900 cursor-pointer group"
//                     onClick={() => setVideoTask(task)}
//                   >
//                     <iframe
//                       src={getYouTubeEmbedUrl(task.video_url) || ''}
//                       className="w-full h-full pointer-events-none"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     />
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
//                       <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
//                         <Play className="w-5 h-5 text-gray-900 ml-0.5" />
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-44 bg-gradient-to-br from-orange-900 to-black flex items-center justify-center">
//                     <Trophy className="w-12 h-12 text-orange-400 opacity-50" />
//                   </div>
//                 )}

//                 {/* Task Info */}
//                 <div className="p-5">
//                   <div className="flex items-start justify-between gap-2 mb-2">
//                     <h3 className="font-semibold text-gray-900">{task.title}</h3>
//                     {task.requires_subscription && (
//                       <span className="shrink-0 flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
//                         <Lock className="w-3 h-3" /> Premium
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

//                   {/* Tier preview */}
//                   <div className="flex gap-2 mb-4">
//                     {TIERS.map((tier) => {
//                       const Icon = tier.icon;
//                       return (
//                         <div key={tier.id} className={`flex-1 rounded-xl p-2 text-center ${tier.bg} border ${tier.border}`}>
//                           <Icon className={`w-4 h-4 mx-auto mb-0.5 ${tier.text}`} />
//                           <p className={`text-xs font-semibold ${tier.text}`}>{tier.name}</p>
//                           <p className="text-xs text-gray-500">
//                             ${(task.amount_to_pay * tier.priceMultiplier).toFixed(0)}
//                           </p>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <button
//                     onClick={() => handleTaskClick(task)}
//                     className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
//                   >
//                     Participate <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )) : (
//               <div className="col-span-3 text-center py-16">
//                 <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-400">No challenges available right now</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Tasks */}
//         {activeTab === 'my-tasks' && (
//           <div className="space-y-4">
//             {myTasksArray.length > 0 ? myTasksArray.map((task: UserTask) => (
//               <div
//                 key={task.id}
//                 className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                   <div className="min-w-0">
//                     <div className="flex flex-wrap items-center gap-2 mb-1">
//                       <h3 className="font-semibold text-gray-900">{task.task_title}</h3>
//                       <StatusBadge status={task.status} />
//                     </div>
//                     <p className="text-sm text-gray-500 mb-2 line-clamp-2">{task.task_description}</p>
//                     <div className="flex flex-wrap gap-4 text-sm">
//                       <span className="text-gray-400">
//                         Started: <span className="text-gray-700 font-medium">
//                           {new Date(task.started_at).toLocaleDateString()}
//                         </span>
//                       </span>
//                       <span className="text-gray-400">
//                         Reward: <span className="text-green-600 font-bold">
//                           +{formatCurrency(task.task_reward)}
//                         </span>
//                       </span>
//                     </div>
//                   </div>

//                   {task.status === 'pending' && (
//                     <div className="shrink-0 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
//                       <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
//                       <p className="text-xs text-yellow-700">Awaiting admin verification</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )) : (
//               <div className="text-center py-16">
//                 <Medal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-400 mb-3">No tasks started yet</p>
//                 <button
//                   onClick={() => setActiveTab('available')}
//                   className="text-sm text-orange-500 hover:underline"
//                 >
//                   Browse available challenges
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── Task Detail + Tier Modal ── */}
//       {selectedTask && (
//         <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4">
//           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

//             {/* Header */}
//             <div className="flex items-center justify-between p-5 border-b border-gray-100">
//               <div>
//                 <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">
//                   {step === 'detail' ? 'Challenge Details' : 'Choose Your Tier'}
//                 </p>
//                 <h2 className="font-bold text-gray-900 text-lg">{selectedTask.title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedTask(null)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Step 1: Detail */}
//             {step === 'detail' && (
//               <div className="p-5 space-y-4">
//                 {/* Video */}
//                 {selectedTask.video_url && getYouTubeEmbedUrl(selectedTask.video_url) && (
//                   <div className="rounded-xl overflow-hidden aspect-video bg-black">
//                     <iframe
//                       src={getYouTubeEmbedUrl(selectedTask.video_url)!}
//                       className="w-full h-full"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                     />
//                   </div>
//                 )}

//                 <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description}</p>

//                 <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
//                   <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">
//                     How it works
//                   </p>
//                   <ol className="space-y-1.5 text-sm text-orange-800">
//                     <li className="flex gap-2"><span className="font-bold">1.</span> Choose Bronze, Silver or Gold tier</li>
//                     <li className="flex gap-2"><span className="font-bold">2.</span> Pay via WhatsApp to our support team</li>
//                     <li className="flex gap-2"><span className="font-bold">3.</span> Wait for payment verification (up to 24h)</li>
//                     <li className="flex gap-2"><span className="font-bold">4.</span> Participate and earn your reward</li>
//                   </ol>
//                 </div>

//                 <button
//                   onClick={() => setStep('tier')}
//                   className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
//                 >
//                   Choose Tier <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             {/* Step 2: Tier Selection */}
//             {step === 'tier' && (
//               <div className="p-5 space-y-4">
//                 <div className="space-y-3">
//                   {TIERS.map((tier) => {
//                     const Icon = tier.icon;
//                     const price = (selectedTask.amount_to_pay * tier.priceMultiplier).toFixed(2);
//                     const reward = (selectedTask.reward_amount * tier.multiplier).toFixed(2);
//                     const isSelected = selectedTier?.id === tier.id;

//                     return (
//                       <div
//                         key={tier.id}
//                         onClick={() => setSelectedTier(tier)}
//                         className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all ${
//                           isSelected
//                             ? `${tier.border} ${tier.bg}`
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         {tier.recommended && (
//                           <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-xs font-bold px-3 py-0.5 rounded-full">
//                             BEST VALUE
//                           </span>
//                         )}
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={`p-2 rounded-xl bg-gradient-to-br ${tier.color}`}>
//                               <Icon className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                               <p className="font-bold text-gray-900">{tier.name}</p>
//                               <p className="text-xs text-gray-500">{tier.description}</p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-gray-900">${price}</p>
//                             <p className="text-xs text-green-600 font-medium">+${reward} reward</p>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 text-center">
//                   Payment is sent directly to support via WhatsApp. Verification takes up to 24 hours.
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setStep('detail')}
//                     className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleProceed}
//                     disabled={!selectedTier}
//                     className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
//                   >
//                     <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
//                       <path d="M11.975 0C5.369 0 0 5.369 0 11.975c0 2.096.548 4.06 1.504 5.765L.057 23.429l5.82-1.525A11.93 11.93 0 0 0 11.975 24C18.581 24 24 18.631 24 11.975 24 5.369 18.581 0 11.975 0zm0 21.904a9.902 9.902 0 0 1-5.032-1.369l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.28c0-5.456 4.437-9.893 9.881-9.893 5.445 0 9.881 4.437 9.881 9.881 0 5.456-4.436 9.916-9.881 9.916z"/>
//                     </svg>
//                     Pay via WhatsApp
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── Video Modal ── */}
//       {videoTask && videoTask.video_url && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
//           onClick={() => setVideoTask(null)}
//         >
//           <div
//             className="w-full max-w-3xl rounded-2xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
//               <p className="text-white font-medium text-sm">{videoTask.title}</p>
//               <button
//                 onClick={() => setVideoTask(null)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="aspect-video bg-black">
//               <iframe
//                 src={getYouTubeEmbedUrl(videoTask.video_url)!}
//                 className="w-full h-full"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </MainLayout>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency } from '@/libs/utils/format';
import { openWhatsApp } from '@/libs/utils/whatsapp';
import { Task, UserTask } from '@/libs/types';
import {
  Play, X, CheckCircle, Clock, AlertCircle,
  Trophy, Medal, Award, ArrowRight, Lock,
  Upload, RefreshCw,
} from 'lucide-react';

// ── Tier config ───────────────────────────────────────────
const TIERS = [
  {
    id: 'bronze' as const,
    name: 'Bronze',
    icon: Award,
    gradient: 'from-amber-700 to-amber-500',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    selectedBorder: 'border-amber-500',
    description: 'Entry level',
    getPrice: (t: Task) => t.bronze_price,
    getReward: (t: Task) => t.bronze_reward,
  },
  {
    id: 'silver' as const,
    name: 'Silver',
    icon: Medal,
    gradient: 'from-gray-500 to-gray-400',
    border: 'border-gray-300',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    selectedBorder: 'border-gray-500',
    description: 'Intermediate',
    getPrice: (t: Task) => t.silver_price,
    getReward: (t: Task) => t.silver_reward,
  },
  {
    id: 'gold' as const,
    name: 'Gold',
    icon: Trophy,
    gradient: 'from-yellow-500 to-yellow-400',
    border: 'border-yellow-400',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    selectedBorder: 'border-yellow-500',
    description: 'Maximum reward',
    recommended: true,
    getPrice: (t: Task) => t.gold_price,
    getReward: (t: Task) => t.gold_reward,
  },
];

// ── Status config ─────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending_payment: { label: 'Awaiting Payment',      color: 'bg-blue-100 text-blue-700',    icon: Clock        },
  pending_review:  { label: 'Under Review',           color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle  },
  in_progress:     { label: 'In Progress',            color: 'bg-orange-100 text-orange-700',icon: RefreshCw    },
  completed:       { label: 'Completed',              color: 'bg-green-100 text-green-700',  icon: CheckCircle  },
  failed:          { label: 'Failed',                 color: 'bg-red-100 text-red-700',      icon: X            },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-600', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Tier badge ────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
  const t = TIERS.find((x) => x.id === tier);
  if (!t) return null;
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.bg} ${t.text}`}>
      <Icon className="w-3 h-3" />
      {t.name}
    </span>
  );
}

// ── Video player ──────────────────────────────────────────
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const isYouTube = src.includes('youtube') || src.includes('youtu.be');
  if (isYouTube) {
    const match = src.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
    const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : null;
    if (!embedUrl) return null;
    return (
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={src}
      controls
      className="w-full h-full object-contain bg-black"
      title={title}
    />
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function TasksPage() {
  const { user } = useAuthStore();
  const { availableTasks, myTasks, fetchAvailableTasks, fetchMyTasks, uploadPayment, completeTask } = useTaskStore();

  const [activeTab, setActiveTab] = useState<'available' | 'my-tasks'>('available');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [videoTask, setVideoTask] = useState<{ src: string; title: string } | null>(null);
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [step, setStep] = useState<'detail' | 'tier'>('detail');
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAvailableTasks();
    fetchMyTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedTier(null);
    setStep('detail');
  };

  const handleProceedToWhatsApp = () => {
    if (!selectedTask || !selectedTier) return;
    const price = formatCurrency(Number(selectedTier.getPrice(selectedTask)));
    const reward = formatCurrency(Number(selectedTier.getReward(selectedTask)));
    const message =
      `Hello! I would like to participate in a task.\n\n` +
      `📋 Task: ${selectedTask.title}\n` +
      `🏅 Tier: ${selectedTier.name}\n` +
      `💰 Payment: ${price}\n` +
      `🎁 Expected Reward: ${reward}\n` +
      `👤 Email: ${user?.email}\n` +
      `👤 Username: ${user?.username}\n\n` +
      `I have made the payment. Please verify and activate my task.`;
    openWhatsApp(message);
    setSelectedTask(null);
    setSelectedTier(null);
  };

  const handleUploadPayment = async (userTaskId: number) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await uploadPayment(userTaskId, uploadFile);
      setUploadingFor(null);
      setUploadFile(null);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCompleteTask = async (userTaskId: number) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await completeTask(userTaskId, uploadFile);
      setUploadingFor(null);
      setUploadFile(null);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const availableTasksArray = Array.isArray(availableTasks) ? availableTasks : [];
  const myTasksArray = Array.isArray(myTasks) ? myTasks : [];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pick a challenge, choose your tier, and earn rewards.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(['available', 'my-tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'available' ? 'Available' : `My Tasks (${myTasksArray.length})`}
            </button>
          ))}
        </div>

        {/* ── Available Tasks ── */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableTasksArray.length > 0 ? availableTasksArray.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all"
              >
                {/* Video thumbnail */}
                {task.video_url ? (
                  <div
                    className="relative h-44 bg-gray-900 cursor-pointer group"
                    onClick={() => setVideoTask({ src: task.video_url!, title: task.title })}
                  >
                    <video
                      src={task.video_url}
                      className="w-full h-full object-cover opacity-70"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-gray-900 to-orange-900 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-orange-400/50" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    {task.requires_subscription && (
                      <span className="shrink-0 flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

                  {/* Tier preview */}
                  <div className="flex gap-2 mb-4">
                    {TIERS.map((tier) => {
                      const Icon = tier.icon;
                      return (
                        <div key={tier.id} className={`flex-1 rounded-xl p-2 text-center ${tier.bg} border ${tier.border}`}>
                          <Icon className={`w-4 h-4 mx-auto mb-0.5 ${tier.text}`} />
                          <p className={`text-xs font-semibold ${tier.text}`}>{tier.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(Number(tier.getPrice(task)))}</p>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleTaskClick(task)}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    Participate <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-16">
                <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No challenges available right now</p>
              </div>
            )}
          </div>
        )}

        {/* ── My Tasks ── */}
        {activeTab === 'my-tasks' && (
          <div className="space-y-4">
            {myTasksArray.length > 0 ? myTasksArray.map((task: UserTask) => (
              <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.task_title}</h3>
                      <TierBadge tier={task.tier} />
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.task_description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-400">
                        Started: <span className="text-gray-700 font-medium">
                          {new Date(task.started_at).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="text-gray-400">
                        Reward: <span className="text-green-600 font-bold">
                          +{formatCurrency(Number(task.reward_amount))}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions per status */}
                  <div className="shrink-0">
                    {task.status === 'pending_payment' && (
                      <div className="space-y-2">
                        {uploadingFor === task.id ? (
                          <div className="space-y-2">
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            />
                            <button
                              onClick={() => fileRef.current?.click()}
                              className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-orange-400 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              {uploadFile ? uploadFile.name : 'Select payment proof'}
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setUploadingFor(null); setUploadFile(null); }}
                                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUploadPayment(task.id)}
                                disabled={!uploadFile || uploading}
                                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
                              >
                                {uploading ? 'Uploading...' : 'Upload'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setUploadingFor(task.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Payment
                          </button>
                        )}
                      </div>
                    )}

                    {task.status === 'pending_review' && (
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                        <p className="text-xs text-yellow-700">Admin reviewing — up to 24h</p>
                      </div>
                    )}

                    {task.status === 'in_progress' && (
                      <div className="space-y-2">
                        {uploadingFor === task.id ? (
                          <div className="space-y-2">
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            />
                            <button
                              onClick={() => fileRef.current?.click()}
                              className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-green-400 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              {uploadFile ? uploadFile.name : 'Select completion proof'}
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setUploadingFor(null); setUploadFile(null); }}
                                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={!uploadFile || uploading}
                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
                              >
                                {uploading ? 'Submitting...' : 'Submit'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setUploadingFor(task.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Submit Completion
                          </button>
                        )}
                      </div>
                    )}

                    {task.status === 'completed' && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <p className="text-xs text-green-700 font-medium">
                          Reward: +{formatCurrency(Number(task.reward_amount))}
                        </p>
                      </div>
                    )}

                    {task.status === 'failed' && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <X className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-xs text-red-700">
                          {task.admin_notes || 'Task was rejected'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <Medal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-3">No tasks started yet</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="text-sm text-orange-500 hover:underline"
                >
                  Browse available challenges
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Task Detail Modal ── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">
                  {step === 'detail' ? 'Challenge Details' : 'Choose Your Tier'}
                </p>
                <h2 className="font-bold text-gray-900">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Step 1 — Detail */}
              {step === 'detail' && (
                <div className="p-5 space-y-4">
                  {selectedTask.video_url && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-black">
                      <VideoPlayer src={selectedTask.video_url} title={selectedTask.title} />
                    </div>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description}</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">How it works</p>
                    <ol className="space-y-1.5 text-sm text-orange-800">
                      <li className="flex gap-2"><span className="font-bold">1.</span> Choose Bronze, Silver or Gold tier</li>
                      <li className="flex gap-2"><span className="font-bold">2.</span> Contact support on WhatsApp to pay</li>
                      <li className="flex gap-2"><span className="font-bold">3.</span> Upload your payment proof</li>
                      <li className="flex gap-2"><span className="font-bold">4.</span> Wait for verification (up to 24h)</li>
                      <li className="flex gap-2"><span className="font-bold">5.</span> Participate and earn your reward</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => setStep('tier')}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    Choose Tier <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2 — Tier */}
              {step === 'tier' && (
                <div className="p-5 space-y-4">
                  <div className="space-y-3">
                    {TIERS.map((tier) => {
                      const Icon = tier.icon;
                      const price = Number(tier.getPrice(selectedTask));
                      const reward = Number(tier.getReward(selectedTask));
                      const isSelected = selectedTier?.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                            isSelected ? `${tier.selectedBorder} ${tier.bg}` : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {tier.recommended && (
                            <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                              BEST VALUE
                            </span>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-gradient-to-br ${tier.gradient}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{tier.name}</p>
                                <p className="text-xs text-gray-500">{tier.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatCurrency(price)}</p>
                              <p className="text-xs text-green-600 font-medium">+{formatCurrency(reward)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Pay via WhatsApp. Verification takes up to 24 hours.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('detail')}
                      className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToWhatsApp}
                      disabled={!selectedTier}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.975 0C5.369 0 0 5.369 0 11.975c0 2.096.548 4.06 1.504 5.765L.057 23.429l5.82-1.525A11.93 11.93 0 0 0 11.975 24C18.581 24 24 18.631 24 11.975 24 5.369 18.581 0 11.975 0zm0 21.904a9.902 9.902 0 0 1-5.032-1.369l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.28c0-5.456 4.437-9.893 9.881-9.893 5.445 0 9.881 4.437 9.881 9.881 0 5.456-4.436 9.916-9.881 9.916z"/>
                      </svg>
                      Pay via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Video Modal ── */}
      {videoTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setVideoTask(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
              <p className="text-white font-medium text-sm truncate">{videoTask.title}</p>
              <button onClick={() => setVideoTask(null)} className="text-gray-400 hover:text-white ml-3 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <VideoPlayer src={videoTask.src} title={videoTask.title} />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}