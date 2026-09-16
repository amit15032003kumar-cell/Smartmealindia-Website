import React, { useState } from 'react';
import {
  Droplets,
  Play,
  Heart,
  Plus,
  Check,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const FloatingQuickActions: React.FC = () => {
  const {
    addWater,
    startWorkout,
    measurePulse,
    activeWorkout,
    hydrationStatus,
    activeTab,
  } = useApp();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleQuickWater = () => {
    addWater(250, 'glass');
    showToast('💧 +250ml logged! Hydration on track.');
  };

  const handleQuickWalk = () => {
    if (activeWorkout?.isActive) {
      showToast('👟 Workout already in progress.');
    } else {
      startWorkout('walk');
      showToast('👟 Outdoor Walk session started! Keep moving.');
    }
  };

  const handleQuickHeart = () => {
    measurePulse();
    showToast('❤️ Measuring PPG pulse stream...');
  };

  return (
    <>
      {/* Dynamic Toast Feedback Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-zinc-700/50 dark:border-zinc-200"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 fill-current animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Quick Action Capsule (Desktop & Tablet) */}
      <aside
        aria-label="Floating Quick Actions"
        className="fixed bottom-24 md:bottom-8 left-4 sm:left-6 z-40 hidden sm:flex items-center gap-2"
      >
        <div className="flex items-center p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xl backdrop-blur-md">
          {/* Quick Water Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickWater}
            title="Quick log 250ml water"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/80 transition-colors cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 fill-current" />
            <span>+250ml</span>
          </motion.button>

          {/* Quick Walk Workout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickWalk}
            title="Start a walking workout"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/80 transition-colors cursor-pointer ml-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeWorkout?.isActive ? 'Walking...' : 'Walk'}</span>
          </motion.button>

          {/* Quick Pulse Check */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickHeart}
            title="Measure live pulse"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/80 transition-colors cursor-pointer ml-1"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Pulse</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};
