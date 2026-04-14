'use client';

import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency } from '@/libs/utils/format';
import { openWhatsApp, openTelegram } from '@/libs/utils/whatsapp';
import { Task, UserTask } from '@/libs/types';
import {
  Play, X, CheckCircle, Clock, AlertCircle,
  Trophy, Medal, Award, ArrowRight, Lock,
  Upload, RefreshCw, Wallet, Building2, Bitcoin,
} from 'lucide-react';

const TIERS = [
  {
    id: 'bronze' as const,
    name: 'Bronze',
    icon: Award,
    cardBg: 'bg-gradient-to-br from-[#3d1f00] to-[#7c3d0a]',
    cardBorder: 'border-[#cd7f32]/40',
    shimmer: 'from-[#cd7f32] via-[#e8a96e] to-[#cd7f32]',
    badgeBg: 'bg-[#cd7f32]/15 border border-[#cd7f32]/30',
    badgeText: 'text-[#cd7f32]',
    iconColor: 'text-[#cd7f32]',
    iconBg: 'bg-[#cd7f32]/20',
    priceColor: 'text-[#e8a96e]',
    rewardColor: 'text-[#f5c57e]',
    selectedRing: 'ring-2 ring-[#cd7f32] ring-offset-2',
    glowColor: 'shadow-[0_0_20px_rgba(205,127,50,0.25)]',
    description: 'Entry level — get started',
    getPrice: (t: Task) => t.bronze_price,
    getReward: (t: Task) => t.bronze_reward,
  },
  {
    id: 'silver' as const,
    name: 'Silver',
    icon: Medal,
    cardBg: 'bg-gradient-to-br from-[#1a1f2e] to-[#2d3650]',
    cardBorder: 'border-[#a8b2c8]/30',
    shimmer: 'from-[#a8b2c8] via-[#d4dbe8] to-[#a8b2c8]',
    badgeBg: 'bg-[#a8b2c8]/15 border border-[#a8b2c8]/30',
    badgeText: 'text-[#c8d0e0]',
    iconColor: 'text-[#c8d0e0]',
    iconBg: 'bg-[#a8b2c8]/20',
    priceColor: 'text-[#c8d0e0]',
    rewardColor: 'text-[#dce3ef]',
    selectedRing: 'ring-2 ring-[#a8b2c8] ring-offset-2',
    glowColor: 'shadow-[0_0_20px_rgba(168,178,200,0.2)]',
    description: 'Intermediate — higher gains',
    getPrice: (t: Task) => t.silver_price,
    getReward: (t: Task) => t.silver_reward,
  },
  {
    id: 'gold' as const,
    name: 'Gold',
    icon: Trophy,
    cardBg: 'bg-gradient-to-br from-[#2d1f00] to-[#5a3e00]',
    cardBorder: 'border-[#ffd700]/40',
    shimmer: 'from-[#ffd700] via-[#ffe766] to-[#ffd700]',
    badgeBg: 'bg-[#ffd700]/15 border border-[#ffd700]/30',
    badgeText: 'text-[#ffd700]',
    iconColor: 'text-[#ffd700]',
    iconBg: 'bg-[#ffd700]/20',
    priceColor: 'text-[#ffe766]',
    rewardColor: 'text-[#fff0a0]',
    selectedRing: 'ring-2 ring-[#ffd700] ring-offset-2',
    glowColor: 'shadow-[0_0_20px_rgba(255,215,0,0.3)]',
    description: 'Maximum reward',
    recommended: true,
    getPrice: (t: Task) => t.gold_price,
    getReward: (t: Task) => t.gold_reward,
  },
];

const CARD_TIERS = [
  { id: 'bronze', bg: 'bg-gradient-to-b from-[#fdf0e4] to-[#fae0c4]', border: 'border-[#cd7f32]/30', text: 'text-[#7c3d0a]', label: 'text-[#a05a20]', icon: Award },
  { id: 'silver', bg: 'bg-gradient-to-b from-[#f2f4f8] to-[#e4e8f0]', border: 'border-[#a8b2c8]/40', text: 'text-[#2d3650]', label: 'text-[#4a5568]', icon: Medal },
  { id: 'gold',   bg: 'bg-gradient-to-b from-[#fffbe6] to-[#fff0a8]', border: 'border-[#ffd700]/40', text: 'text-[#5a3e00]', label: 'text-[#7a5500]', icon: Trophy },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending_payment: { label: 'Awaiting Payment',  color: 'bg-blue-100 text-blue-700',    icon: Clock       },
  pending_review:  { label: 'Under Review',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  in_progress:     { label: 'In Progress',       color: 'bg-orange-100 text-orange-700',icon: RefreshCw   },
  completed:       { label: 'Completed',         color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  failed:          { label: 'Failed',            color: 'bg-red-100 text-red-700',      icon: X           },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-600', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    bronze: { bg: 'bg-[#cd7f32]/15', text: 'text-[#7c3d0a]', icon: Award },
    silver: { bg: 'bg-[#a8b2c8]/15', text: 'text-[#2d3650]', icon: Medal },
    gold:   { bg: 'bg-[#ffd700]/15', text: 'text-[#5a3e00]', icon: Trophy },
  };
  const t = map[tier];
  if (!t) return null;
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.bg} ${t.text}`}>
      <Icon className="w-3 h-3" />{tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

function VideoPlayer({ src, title }: { src: string; title: string }) {
  const isYouTube = src.includes('youtube') || src.includes('youtu.be');
  if (isYouTube) {
    const match = src.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
    const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : null;
    if (!embedUrl) return null;
    return <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  }
  return <video src={src} controls className="w-full h-full object-contain bg-black" title={title} />;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M11.975 0C5.369 0 0 5.369 0 11.975c0 2.096.548 4.06 1.504 5.765L.057 23.429l5.82-1.525A11.93 11.93 0 0 0 11.975 24C18.581 24 24 18.631 24 11.975 24 5.369 18.581 0 11.975 0zm0 21.904a9.902 9.902 0 0 1-5.032-1.369l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.28c0-5.456 4.437-9.893 9.881-9.893 5.445 0 9.881 4.437 9.881 9.881 0 5.456-4.436 9.916-9.881 9.916z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
  </svg>
);

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
  const [showSupportModal, setShowSupportModal] = useState(false);
const [supportMessage, setSupportMessage] = useState("");

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
    setSupportMessage(message);
setShowSupportModal(true);
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
    } catch { alert('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const handleCompleteTask = async (userTaskId: number) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await completeTask(userTaskId, uploadFile);
      setUploadingFor(null);
      setUploadFile(null);
    } catch { alert('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const availableTasksArray = Array.isArray(availableTasks) ? availableTasks : [];
  const myTasksArray = Array.isArray(myTasks) ? myTasks : [];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <p className="text-sm text-gray-500 mt-1">Pick a challenge, choose your tier, and earn rewards.</p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(['available', 'my-tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'available' ? 'Available' : `My Tasks (${myTasksArray.length})`}
            </button>
          ))}
        </div>

        {/* Available Tasks */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableTasksArray.length > 0 ? availableTasksArray.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-200 flex flex-col">
                {task.video_url ? (
                  <div className="relative h-44 bg-gray-900 cursor-pointer group" onClick={() => setVideoTask({ src: task.video_url!, title: task.title })}>
                    <video src={task.video_url} className="w-full h-full object-cover opacity-70" muted preload="metadata" />
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
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-900 leading-snug">{task.title}</h3>
                    {task.requires_subscription && (
                      <span className="shrink-0 flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{task.description}</p>
                  <div className="flex gap-2 mb-4">
                    {CARD_TIERS.map((tier) => {
                      const Icon = tier.icon;
                      const priceVal = tier.id === 'bronze' ? task.bronze_price : tier.id === 'silver' ? task.silver_price : task.gold_price;
                      return (
                        <div key={tier.id} className={`flex-1 rounded-xl p-2.5 text-center border ${tier.bg} ${tier.border}`}>
                          <Icon className={`w-4 h-4 mx-auto mb-1 ${tier.text}`} />
                          <p className={`text-[11px] font-bold uppercase tracking-wide ${tier.label}`}>{tier.id}</p>
                          <p className={`text-xs font-semibold mt-0.5 ${tier.text}`}>{formatCurrency(Number(priceVal))}</p>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => handleTaskClick(task)} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
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

        {/* My Tasks */}
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
                      <span className="text-gray-400">Started: <span className="text-gray-700 font-medium">{new Date(task.started_at).toLocaleDateString()}</span></span>
                      <span className="text-gray-400">Reward: <span className="text-green-600 font-bold">+{formatCurrency(Number(task.reward_amount))}</span></span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {task.status === 'pending_payment' && (
                      uploadingFor === task.id ? (
                        <div className="space-y-2">
                          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                          <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-orange-400 transition-colors">
                            <Upload className="w-4 h-4" />{uploadFile ? uploadFile.name : 'Select payment proof'}
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => { setUploadingFor(null); setUploadFile(null); }} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => handleUploadPayment(task.id)} disabled={!uploadFile || uploading} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">{uploading ? 'Uploading...' : 'Upload'}</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setUploadingFor(task.id)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors">
                          <Upload className="w-4 h-4" /> Upload Payment
                        </button>
                      )
                    )}
                    {task.status === 'pending_review' && (
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                        <p className="text-xs text-yellow-700">Admin reviewing — up to 24h</p>
                      </div>
                    )}
                    {task.status === 'in_progress' && (
                      uploadingFor === task.id ? (
                        <div className="space-y-2">
                          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                          <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-green-400 transition-colors">
                            <Upload className="w-4 h-4" />{uploadFile ? uploadFile.name : 'Select completion proof'}
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => { setUploadingFor(null); setUploadFile(null); }} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => handleCompleteTask(task.id)} disabled={!uploadFile || uploading} className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">{uploading ? 'Submitting...' : 'Submit'}</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setUploadingFor(task.id)} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors">
                          <CheckCircle className="w-4 h-4" /> Submit Completion
                        </button>
                      )
                    )}
                    {task.status === 'completed' && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <p className="text-xs text-green-700 font-medium">Reward: +{formatCurrency(Number(task.reward_amount))}</p>
                      </div>
                    )}
                    {task.status === 'failed' && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <X className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-xs text-red-700">{task.admin_notes || 'Task was rejected'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <Medal className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-3">No tasks started yet</p>
                <button onClick={() => setActiveTab('available')} className="text-sm text-orange-500 hover:underline">Browse available challenges</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">
                  {step === 'detail' ? 'Challenge Details' : 'Choose Your Tier'}
                </p>
                <h2 className="font-bold text-gray-900">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
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
                      <li className="flex gap-2"><span className="font-bold">2.</span> Contact support on WhatsApp or Telegram to pay</li>
                      <li className="flex gap-2"><span className="font-bold">3.</span> Upload your payment proof</li>
                      <li className="flex gap-2"><span className="font-bold">4.</span> Wait for verification (up to 24h)</li>
                      <li className="flex gap-2"><span className="font-bold">5.</span> Participate and earn your reward</li>
                    </ol>
                  </div>
                  <button onClick={() => setStep('tier')} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Choose Tier <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 'tier' && (
                <div className="p-5 space-y-3">
                  {TIERS.map((tier) => {
                    const Icon = tier.icon;
                    const price = Number(tier.getPrice(selectedTask));
                    const reward = Number(tier.getReward(selectedTask));
                    const isSelected = selectedTier?.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${tier.cardBg} ${tier.cardBorder} ${isSelected ? `${tier.selectedRing} ${tier.glowColor}` : 'hover:brightness-110'}`}
                      >
                        {tier.recommended && (
                          <span className={`absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-gradient-to-r ${tier.shimmer} text-black`}>
                            Best Value
                          </span>
                        )}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                              <Icon className={`w-5 h-5 ${tier.iconColor}`} />
                            </div>
                            <div>
                              <p
                                className="font-extrabold text-base uppercase tracking-wider"
                                style={{
                                  background: `linear-gradient(90deg, ${tier.id === 'bronze' ? '#cd7f32, #e8a96e, #cd7f32' : tier.id === 'silver' ? '#a8b2c8, #dce3ef, #a8b2c8' : '#ffd700, #ffe766, #ffd700'})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}
                              >{tier.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{tier.description}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-lg font-bold ${tier.priceColor}`}>{formatCurrency(price)}</p>
                            <p className={`text-xs font-semibold mt-0.5 ${tier.rewardColor}`}>+{formatCurrency(reward)} reward</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${tier.iconBg}`}>
                            <CheckCircle className={`w-4 h-4 ${tier.iconColor}`} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {user && (user.bank_name || user.btc_wallet || user.eth_wallet || user.usdt_wallet) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Payment Methods</p>
                      <div className="space-y-1.5">
                        {user.bank_name && user.account_number && (
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{user.bank_name} — {user.account_number} ({user.account_name})</span>
                          </div>
                        )}
                        {user.btc_wallet && (
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Bitcoin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span className="truncate">{user.btc_wallet}</span>
                          </div>
                        )}
                        {user.eth_wallet && (
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Wallet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{user.eth_wallet}</span>
                          </div>
                        )}
                        {user.usdt_wallet && (
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Wallet className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            <span className="truncate">{user.usdt_wallet}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 text-center">Your details will be sent to support via WhatsApp & Telegram.</p>

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setStep('detail')} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors">
                      Back
                    </button>
                    <button
                      onClick={handleProceedToWhatsApp}
                      disabled={!selectedTier}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <WhatsAppIcon />
                      <TelegramIcon />
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoTask && videoTask.src && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setVideoTask(null)}>
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
      


      {showSupportModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
      
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Contact Support
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose your preferred platform
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        
        {/* WhatsApp */}
        <button
          onClick={() => {
            openWhatsApp(supportMessage);
            setShowSupportModal(false);
          }}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          <WhatsAppIcon />
          Continue with WhatsApp
        </button>

        {/* Telegram */}
        <button
          onClick={() => {
            openTelegram(supportMessage);
            setShowSupportModal(false);
          }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          <TelegramIcon />
          Continue with Telegram
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Cancel */}
      <button
        onClick={() => setShowSupportModal(false)}
        className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </MainLayout>
  );
}