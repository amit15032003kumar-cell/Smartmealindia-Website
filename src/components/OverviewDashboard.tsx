import React from 'react';
import {
  Droplets,
  Footprints,
  Heart,
  Watch,
  Plus,
  Play,
  Activity,
  CheckCircle2,
  Smile,
  ArrowRight,
  BatteryCharging,
  Flame,
  Zap,
  RotateCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { WaterTracker } from './WaterTracker';
import { HeartbeatMonitor } from './HeartbeatMonitor';

export const OverviewDashboard: React.FC<{
  onOpenProfile: () => void;
}> = ({ onOpenProfile }) => {
  const {
    userProfile,
    waterLog,
    addWater,
    hydrationStatus,
    dailySteps,
    stepGoal,
    walkDistanceKm,
    runDistanceKm,
    caloriesBurnedToday,
    heartMetrics,
    watchDevice,
    syncWatch,
    setActiveTab,
    startWorkout,
    measurePulse,
    formatWater,
    formatDistance,
    t,
  } = useApp();

  const stepPercentage = Math.min(Math.round((dailySteps / (stepGoal || 10000)) * 100), 100);
  const waterPercentage = Math.min(Math.round((waterLog.currentMl / (waterLog.goalMl || 2800)) * 100), 100);
  const totalDistanceKm = Number((walkDistanceKm + runDistanceKm).toFixed(2));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Greeting & Watch System Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="surface-card p-4 sm:p-6 lg:p-7"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Alex Rivera Greeting & Direct Goal Targets */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenProfile}
                className="relative group cursor-pointer shrink-0"
                title="Edit user profile & choose cartoon avatar"
                aria-label="Edit Profile & Cartoon Avatar"
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm ring-4 ring-emerald-500/15 bg-zinc-100 dark:bg-zinc-800"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-xs" />
              </motion.button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-contrast-heading tracking-tight">
                    {t('welcomeBack')}, {userProfile.name}!
                  </h1>
                  {/* "Water: I am Good" / Hydration status highlight */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      hydrationStatus === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40'
                        : 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300/40'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                    </span>
                    <span>Water: I am Good</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-contrast-muted mt-1 leading-relaxed">
                  Target: <span className="font-semibold text-contrast-body">{formatWater(waterLog?.goalMl ?? 2800)} water</span> • <span className="font-semibold text-contrast-body">{(stepGoal ?? 10000).toLocaleString()} steps</span> • <span className="font-semibold text-teal-600 dark:text-teal-400">{watchDevice?.name ?? 'Samsung Galaxy Watch 6'} synced</span>
                </p>
              </div>
            </div>

            {/* Quick Action Triggers directly mapped to user tasks */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <motion.button
                id="dash-quick-water"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addWater(250, 'glass')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 transition-all cursor-pointer min-h-[42px] shadow-xs"
              >
                <Droplets className="w-3.5 h-3.5 fill-current" />
                <span>+250ml Water</span>
              </motion.button>

              <motion.button
                id="dash-quick-walk"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startWorkout('walk')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/30 transition-all cursor-pointer min-h-[42px]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Walk</span>
              </motion.button>

              <motion.button
                id="dash-quick-heart"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => measurePulse()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/80 transition-all cursor-pointer min-h-[42px] shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Check Pulse</span>
              </motion.button>
            </div>
          </div>

          {/* RIGHT: DEDICATED WATCH SYSTEM SECTION */}
          <div className="lg:col-span-5 p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-200/70 dark:border-teal-800/70 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-contrast-heading">
                      Watch System
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Synced</span>
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 truncate">
                    {watchDevice?.name ?? 'Samsung Galaxy Watch 6'}
                  </p>
                </div>
              </div>

              {/* Battery Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-bold text-contrast-heading">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                <span>{watchDevice?.batteryPercent ?? 94}%</span>
              </div>
            </div>

            {/* Tri-telemetry Glance */}
            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold text-contrast-muted uppercase tracking-wider block">Watch Face</span>
                <span className="text-xs font-bold text-contrast-heading capitalize truncate block mt-0.5">
                  {watchDevice?.activeFace ?? 'Sport'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold text-contrast-muted uppercase tracking-wider block">Steps Sync</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-numbers block mt-0.5">
                  {(dailySteps ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold text-contrast-muted uppercase tracking-wider block">Pulse BPM</span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-numbers block mt-0.5">
                  {heartMetrics?.currentBpm ?? 72}
                </span>
              </div>
            </div>

            {/* Action Buttons: Sync Watch & Open Watch View */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => syncWatch()}
                disabled={watchDevice?.isSyncing}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-contrast-heading border border-zinc-200/80 dark:border-zinc-700 transition-all cursor-pointer shadow-xs min-h-[40px]"
                title="Sync watch telemetry now"
              >
                <RotateCw className={`w-3.5 h-3.5 ${watchDevice?.isSyncing ? 'animate-spin text-teal-500' : 'text-zinc-500'}`} />
                <span>{watchDevice?.isSyncing ? t('syncing') : t('syncNow')}</span>
              </button>

              <button
                onClick={() => setActiveTab('watch')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all cursor-pointer shadow-xs min-h-[40px]"
                title="Open interactive smartwatch system view"
              >
                <span>Open Watch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Essential Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Water Intake Status ("Water I Good") */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('water')}
          className="surface-card surface-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer border hover:border-sky-400 dark:hover:border-sky-600"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-contrast-muted">
              <Droplets className="w-4 h-4 text-sky-500 fill-sky-500/20" />
              <span>{t('waterTracker')}</span>
            </span>
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 tabular-numbers">
              {waterPercentage}%
            </span>
          </div>
          <p className="text-2xl font-black text-contrast-heading tabular-numbers">
            {formatWater(waterLog.currentMl)}
          </p>
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mt-3">
            <div
              className="h-full bg-sky-500 transition-all duration-500 rounded-full"
              style={{ width: `${waterPercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 mt-2 block">
            {hydrationStatus === 'optimal' ? 'Optimal Hydration' : 'Hydration: I am Good'}
          </span>
        </motion.div>

        {/* 2. Walking & Running Steps */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('walkrun')}
          className="surface-card surface-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer border hover:border-emerald-400 dark:hover:border-emerald-600"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-contrast-muted">
              <Footprints className="w-4 h-4 text-emerald-500" />
              <span>{t('walkAndRun')}</span>
            </span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-numbers">
              {stepPercentage}%
            </span>
          </div>
          <p className="text-2xl font-black text-contrast-heading tabular-numbers">
            {dailySteps.toLocaleString()}
          </p>
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${stepPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-contrast-muted mt-2 block tabular-numbers">
            Total: {formatDistance(totalDistanceKm)} • {caloriesBurnedToday} kcal
          </span>
        </motion.div>

        {/* 3. Live Heart Rate & Beat */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('heart')}
          className="surface-card surface-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer border hover:border-rose-400 dark:hover:border-rose-600"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-contrast-muted">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-cardiac-lubdub" />
              <span>{t('heartHealth')}</span>
            </span>
            <Activity className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-contrast-heading tabular-numbers">
            {heartMetrics.currentBpm} <span className="text-xs font-semibold text-contrast-muted">BPM</span>
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{heartMetrics.rhythmStatus}</span>
          </div>
          <span className="text-[11px] text-contrast-muted mt-1 block">
            Resting: {heartMetrics.restingBpm} bpm • HRV: {heartMetrics.hrvMs} ms
          </span>
        </motion.div>

        {/* 4. Watch System Glance */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('watch')}
          className="surface-card surface-card-interactive p-4 sm:p-5 rounded-2xl cursor-pointer border hover:border-teal-400 dark:hover:border-teal-600"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-contrast-muted">
              <Watch className="w-4 h-4 text-teal-500" />
              <span>{t('watchSystem')}</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-contrast-body tabular-numbers">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>{watchDevice.batteryPercent}%</span>
            </div>
          </div>
          <p className="text-lg font-black text-contrast-heading truncate">
            {watchDevice.name}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-teal-600 dark:text-teal-400 font-bold">
            <Zap className="w-3 h-3" />
            <span>Sensors Live</span>
          </div>
          <span className="text-[11px] text-contrast-muted mt-1 block">
            Face: <strong className="capitalize text-contrast-heading">{watchDevice.activeFace}</strong>
          </span>
        </motion.div>
      </div>

      {/* Main Grid: Water Tracker on Left, Heartbeat Monitor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Water Tracker ("water I good") */}
        <div className="lg:col-span-6 space-y-6">
          <WaterTracker compact={true} />
        </div>

        {/* Right: Live Heartbeat & ECG Pulse Monitor */}
        <div className="lg:col-span-6 space-y-6">
          <HeartbeatMonitor compact={true} />
        </div>
      </div>
    </div>
  );
};
