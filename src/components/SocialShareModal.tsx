import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Droplets,
  Footprints,
  Heart,
  Watch,
  Smile,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    waterLog,
    hydrationPercentage,
    hydrationStatus,
    dailySteps,
    stepGoal,
    walkDistanceKm,
    runDistanceKm,
    heartMetrics,
    watchDevice,
    formatWater,
    formatDistance,
    t,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<'water' | 'steps' | 'heart' | 'watch'>('water');

  if (!isOpen) return null;

  const totalDist = ((walkDistanceKm ?? 0) + (runDistanceKm ?? 0)).toFixed(2);

  const milestones = {
    water: {
      title: '💧 Hydration Mastered — Water: I am Good!',
      description: `Hit ${formatWater(waterLog?.currentMl ?? 0)} of fresh water today with a ${waterLog?.streakDays ?? 1}-day streak!`,
      stat: `${hydrationPercentage ?? 0}% Met`,
      icon: Droplets,
      color: 'from-sky-500 to-blue-600',
    },
    steps: {
      title: '👟 Walking & Running Milestone Smashed!',
      description: `Logged ${(dailySteps ?? 0).toLocaleString()} steps and ${formatDistance(Number(totalDist))} outdoors!`,
      stat: `${(dailySteps ?? 0).toLocaleString()} steps`,
      icon: Footprints,
      color: 'from-emerald-500 to-teal-600',
    },
    heart: {
      title: '❤️ Healthy Cardiovascular Heartbeat!',
      description: `Resting heart rate steady at ${heartMetrics?.restingBpm ?? 60} BPM with normal sinus rhythm!`,
      stat: `${heartMetrics?.currentBpm ?? 72} BPM`,
      icon: Heart,
      color: 'from-rose-500 to-red-600',
    },
    watch: {
      title: '⌚ Smartwatch Health Telemetry Connected!',
      description: `Synced with ${watchDevice?.name ?? 'Smartwatch'} with 24/7 PPG and accelerometer sensor tracking!`,
      stat: `${watchDevice?.batteryPercent ?? 100}% Battery`,
      icon: Watch,
      color: 'from-teal-500 to-cyan-600',
    },
  };

  const selected = milestones[activeMilestone];
  const shareText = `${selected.title}\n${selected.description}\nLogged via Smartmealindia Health Tracker 💧👟❤️⌚`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {t('shareMilestone')}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Celebrate water, walk & run, heart rate, or watch telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Selector Tabs */}
        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {(['water', 'steps', 'heart', 'watch'] as const).map((key) => {
              const item = milestones[key];
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMilestone(key)}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    activeMilestone === key
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] capitalize">{key}</span>
                </button>
              );
            })}
          </div>

          {/* Milestone Visual Preview Card */}
          <div
            className={`p-6 rounded-2xl bg-gradient-to-br ${selected.color} text-white shadow-xl space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                Daily Achievement
              </span>
              <span className="text-xl font-black tabular-numbers">{selected.stat}</span>
            </div>
            <h4 className="text-lg font-black">{selected.title}</h4>
            <p className="text-xs text-white/90 leading-relaxed">{selected.description}</p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-white/80 border-t border-white/20">
              <span>{userProfile.name}</span>
              <span>Smartmealindia</span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-contrast-heading transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
            >
              <span>WhatsApp</span>
            </button>

            <button
              onClick={shareViaTwitter}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 shadow-sm transition-colors cursor-pointer"
            >
              <span>X (Twitter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
