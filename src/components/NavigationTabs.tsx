import React from 'react';
import {
  LayoutDashboard,
  Droplets,
  Footprints,
  HeartPulse,
  Watch,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, t, hydrationStatus, activeWorkout } = useApp();

  const tabs = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'water',
      label: t('waterTracker'),
      icon: Droplets,
      badge: hydrationStatus === 'good' || hydrationStatus === 'optimal' ? 'Good' : null,
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    },
    {
      id: 'walkrun',
      label: t('walkAndRun'),
      icon: Footprints,
      badge: activeWorkout?.isActive ? 'Live' : null,
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
    },
    {
      id: 'heart',
      label: t('heartHealth'),
      icon: HeartPulse,
      badge: null,
    },
    {
      id: 'watch',
      label: t('watchSystem'),
      icon: Watch,
      badge: 'Synced',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation Tabs with Frosted Acrylic & Sliding Indicator */}
      <div className="w-full bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-16 z-20 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Main Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    isActive
                      ? 'text-white dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Sliding Motion Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-emerald-600 dark:bg-emerald-400 rounded-xl shadow-md shadow-emerald-600/25 dark:shadow-emerald-400/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/25 text-white dark:bg-zinc-950/25 dark:text-zinc-950'
                            : tab.badgeColor
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-xl px-2 py-1 safe-bottom shadow-2xl"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-400/10'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <motion.span
                      layoutId="mobileActiveDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] leading-tight tracking-tight mt-1 max-w-[58px] truncate text-center font-semibold">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
