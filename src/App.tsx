/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewDashboard } from './components/OverviewDashboard';
import { WaterTracker } from './components/WaterTracker';
import { WalkAndRunTracker } from './components/WalkAndRunTracker';
import { HeartbeatMonitor } from './components/HeartbeatMonitor';
import { WatchSystemView } from './components/WatchSystemView';
import { ProfileModal } from './components/ProfileModal';
import { SocialShareModal } from './components/SocialShareModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { FloatingQuickActions } from './components/FloatingQuickActions';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplets,
  Footprints,
  Heart,
  Watch,
  Smile,
  ShieldCheck,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    hydrationStatus,
    dailySteps,
    stepGoal,
    heartMetrics,
    watchDevice,
    formatWater,
    waterLog,
    t,
  } = useApp();

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col font-sans pb-20 md:pb-8 ambient-mesh relative selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Scroll Progress Bar & Floating Back to Top */}
      <ScrollProgressBar />

      {/* Floating Quick Action Capsule */}
      <FloatingQuickActions />

      {/* Top Navigation Bar */}
      <Navbar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Feature Tabs */}
      <NavigationTabs />

      {/* Main Content View with Smooth AnimatePresence transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 pb-28 md:pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <OverviewDashboard onOpenProfile={() => setIsProfileModalOpen(true)} />
            </motion.div>
          )}

          {activeTab === 'water' && (
            <motion.div
              key="water"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <WaterTracker compact={false} />
            </motion.div>
          )}

          {activeTab === 'walkrun' && (
            <motion.div
              key="walkrun"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <WalkAndRunTracker />
            </motion.div>
          )}

          {activeTab === 'heart' && (
            <motion.div
              key="heart"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <HeartbeatMonitor compact={false} />
            </motion.div>
          )}

          {activeTab === 'watch' && (
            <motion.div
              key="watch"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <WatchSystemView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Minimalist Desktop Status Strip */}
      <footer className="hidden md:block w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-contrast-muted">
          <div className="flex items-center gap-4">
            {/* Water status */}
            <span className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Water: {formatWater(waterLog?.currentMl ?? 0)} / {formatWater(waterLog?.goalMl ?? 2800)} ({hydrationStatus === 'optimal' ? 'Optimal' : 'I am Good'})</span>
            </span>

            <span>•</span>

            {/* Steps */}
            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-3.5 h-3.5" />
              <span>{(dailySteps ?? 0).toLocaleString()} / {(stepGoal ?? 10000).toLocaleString()} steps</span>
            </span>

            <span>•</span>

            {/* Heart */}
            <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
              <span>{heartMetrics?.currentBpm ?? 72} BPM ({heartMetrics?.rhythmStatus ?? 'Normal Sinus'})</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <Watch className="w-3.5 h-3.5" />
              <span>{watchDevice.name} ({watchDevice.batteryPercent}%)</span>
            </span>
            <span>•</span>
            <span className="text-zinc-500">24/7 Biometric Sync</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
