import React, { useState, memo } from 'react';
import {
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  CupSoda,
  Flame,
  Clock,
  Trash2,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

// Fluid Wave Canvas Component
const FluidWaveCanvas = memo(({ percentage }: { percentage: number }) => {
  const clampedHeight = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-b from-sky-50 via-sky-100/50 to-blue-100/60 dark:from-zinc-900/90 dark:via-zinc-800/80 dark:to-sky-950/60 border border-sky-200/80 dark:border-sky-900/50 overflow-hidden shadow-inner flex flex-col justify-end">
      {/* Target Waterline Guideline at 100% */}
      <div className="absolute top-4 left-0 right-0 border-b border-dashed border-sky-400/60 dark:border-sky-500/50 z-10 px-4 flex justify-between items-center text-[10px] font-bold text-sky-600 dark:text-sky-300">
        <span>Daily Target (100%)</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 animate-spin" /> Optimal Level
        </span>
      </div>

      {/* Fluid Rising Water Body */}
      <div
        className="relative w-full transition-all duration-700 ease-out flex flex-col justify-start"
        style={{ height: `${clampedHeight}%` }}
      >
        {/* Animated Double Wave Surface */}
        <div className="absolute -top-6 left-0 right-0 w-[200%] h-8 overflow-hidden pointer-events-none opacity-85">
          <svg
            className="w-full h-full animate-wave-fast text-sky-400 dark:text-sky-500 fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="absolute -top-5 left-0 right-0 w-[200%] h-7 overflow-hidden pointer-events-none opacity-50">
          <svg
            className="w-full h-full animate-wave-slow text-teal-300 dark:text-teal-400 fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,20 C200,80 400,-20 600,50 C800,110 1000,20 1200,50 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* Deep Water Base Gradient */}
        <div className="w-full h-full bg-gradient-to-t from-sky-600 via-sky-500 to-sky-400 dark:from-sky-800 dark:via-sky-700 dark:to-sky-500 opacity-95" />
      </div>

      {/* Center Percentage Display */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md border border-white/60 dark:border-zinc-700 mb-1.5"
        >
          <Droplets className="w-7 h-7 text-sky-500 dark:text-sky-400" />
        </motion.div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 drop-shadow-sm tabular-numbers">
            {clampedHeight}%
          </span>
        </div>
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 mt-1 drop-shadow-sm">
          {clampedHeight >= 100 ? 'Hydration Target Reached!' : clampedHeight >= 70 ? 'Water Level: Good & Balanced' : 'Drink Water Regularly'}
        </span>
      </div>
    </div>
  );
});

FluidWaveCanvas.displayName = 'FluidWaveCanvas';

export const WaterTracker: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    waterLog,
    addWater,
    resetWater,
    setWaterGoal,
    hydrationStatus,
    hydrationPercentage,
    formatWater,
    t,
    userProfile,
  } = useApp();

  const [customMl, setCustomMl] = useState<string>('300');
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [newGoalInput, setNewGoalInput] = useState<string>((waterLog?.goalMl ?? 2800).toString());

  const currentMl = waterLog?.currentMl ?? 0;
  const goalMl = waterLog?.goalMl ?? 2800;
  const isGoalMet = currentMl >= goalMl;
  const remainingMl = Math.max(0, goalMl - currentMl);

  const glassVolume = 250;
  const totalGlasses = Math.max(1, Math.round(goalMl / glassVolume));
  const filledGlasses = Math.floor(currentMl / glassVolume);

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!isNaN(val) && val > 0) {
      addWater(val, 'custom');
      setCustomMl('250');
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newGoalInput, 10);
    if (!isNaN(val) && val >= 500) {
      setWaterGoal(val);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="surface-card p-5 sm:p-7 space-y-6">
      {/* Header with Hydration Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-contrast-heading">
                {t('waterIntake')}
              </h3>
              {/* "Water I Good" Status Pill */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  hydrationStatus === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/40'
                    : hydrationStatus === 'good'
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300/40'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/40'
                }`}
              >
                {hydrationStatus === 'optimal' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hydration: Optimal</span>
                  </>
                ) : hydrationStatus === 'good' ? (
                  <>
                    <Smile className="w-3.5 h-3.5" />
                    <span>Water: I am Good</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Drink Water</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-contrast-muted mt-0.5">
              Daily Target: <span className="font-semibold text-sky-600 dark:text-sky-400">{formatWater(waterLog.goalMl)}</span> / day • Streak: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{waterLog.streakDays} days</span>
            </p>
          </div>
        </div>

        {/* Goal Action */}
        <div className="flex items-center gap-2">
          {isEditingGoal ? (
            <form onSubmit={handleSaveGoal} className="flex items-center gap-1.5">
              <input
                type="number"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                min="500"
                max="6000"
                step="100"
                className="w-24 px-2 py-1 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-contrast-heading"
                aria-label="Water goal in ml"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="px-2 py-1 text-xs rounded-lg text-contrast-muted hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setNewGoalInput((waterLog?.goalMl ?? 2800).toString());
                setIsEditingGoal(true);
              }}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Edit Target
            </button>
          )}
        </div>
      </div>

      {/* Main Hydration Display: Wave + Quick Drink Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Wave Fluid Canvas */}
        <div className={compact ? 'md:col-span-12' : 'md:col-span-5'}>
          <FluidWaveCanvas percentage={hydrationPercentage} />

          <div className="flex items-center justify-between mt-3 px-1 text-xs">
            <span className="text-contrast-muted">
              Drank: <strong className="text-contrast-heading tabular-numbers font-bold">{formatWater(waterLog.currentMl)}</strong>
            </span>
            <span className="text-contrast-muted">
              {isGoalMet ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Achieved!</span>
              ) : (
                <span>Remaining: <strong className="text-contrast-heading tabular-numbers">{formatWater(remainingMl)}</strong></span>
              )}
            </span>
          </div>
        </div>

        {/* Quick Add Presets and Glass Tracker */}
        <div className={compact ? 'md:col-span-12 space-y-4' : 'md:col-span-7 space-y-4'}>
          {/* Glass Counter Grid */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-contrast-heading mb-2">
              <span className="flex items-center gap-1.5">
                <CupSoda className="w-4 h-4 text-sky-500" />
                <span>Glasses Drank ({Math.min(filledGlasses, totalGlasses)} / {totalGlasses})</span>
              </span>
              <span className="text-[11px] font-normal text-contrast-muted">250 ml each</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
              {Array.from({ length: totalGlasses }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => addWater(glassVolume, 'glass')}
                  title={`Click to drink Glass ${i + 1} (250 ml)`}
                  className={`w-6 h-8 rounded-md transition-all duration-300 flex items-end p-0.5 cursor-pointer ${
                    i < filledGlasses
                      ? 'bg-sky-500 shadow-sm shadow-sky-500/40 hover:bg-sky-400'
                      : 'bg-zinc-200 dark:bg-zinc-700/70 hover:bg-sky-200 dark:hover:bg-sky-900/50'
                  }`}
                >
                  <div
                    className={`w-full rounded-xs transition-all duration-300 ${
                      i < filledGlasses ? 'bg-sky-100 dark:bg-sky-200 h-2' : 'h-0'
                    }`}
                  />
                </button>
              ))}
              {filledGlasses > totalGlasses && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 self-center ml-1.5">
                  +{filledGlasses - totalGlasses} bonus glasses!
                </span>
              )}
            </div>
          </div>

          {/* Quick Portions: Glass, Bottle, Tumbler, Sip */}
          <div>
            <p className="text-xs font-bold text-contrast-heading mb-2">
              {t('quickAdd')} Water Portions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Sip +150ml */}
              <motion.button
                id="water-add-150"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addWater(150, 'sip')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-900 text-sky-950 dark:text-sky-100 transition-all cursor-pointer shadow-xs"
              >
                <span className="text-xs font-extrabold">Sip</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">+150 ml</span>
              </motion.button>

              {/* Glass +250ml */}
              <motion.button
                id="water-add-250"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addWater(250, 'glass')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-900 text-sky-950 dark:text-sky-100 transition-all cursor-pointer shadow-xs"
              >
                <span className="text-xs font-extrabold">{t('glass')}</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">+250 ml</span>
              </motion.button>

              {/* Bottle +500ml */}
              <motion.button
                id="water-add-500"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addWater(500, 'bottle')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-900 text-sky-950 dark:text-sky-100 transition-all cursor-pointer shadow-xs"
              >
                <span className="text-xs font-extrabold">{t('bottle')}</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">+500 ml</span>
              </motion.button>

              {/* Tumbler +750ml */}
              <motion.button
                id="water-add-750"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addWater(750, 'tumbler')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-900 text-sky-950 dark:text-sky-100 transition-all cursor-pointer shadow-xs"
              >
                <span className="text-xs font-extrabold">{t('tumbler')}</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">+750 ml</span>
              </motion.button>
            </div>
          </div>

          {/* Stepper Fine-tuning, Custom Input & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => addWater(-100, 'custom')}
                disabled={waterLog.currentMl <= 0}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-contrast-body hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Subtract 100ml"
                aria-label="Subtract 100ml"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-contrast-muted tabular-numbers">
                ±100 ml
              </span>
              <button
                onClick={() => addWater(100, 'custom')}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-contrast-body hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Add 100ml"
                aria-label="Add 100ml"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom ML Input */}
            <form onSubmit={handleCustomAdd} className="flex items-center gap-1.5">
              <input
                type="number"
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                min="10"
                max="2000"
                step="50"
                className="w-20 px-2 py-1 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-contrast-heading"
                placeholder="ml"
                aria-label="Custom ml"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 cursor-pointer shadow-xs"
              >
                +Add
              </button>
            </form>

            {/* Reset Today's Log */}
            <button
              onClick={resetWater}
              className="flex items-center gap-1 text-xs font-semibold text-contrast-muted hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Reset today's water"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('reset')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Water Intake History List (if not in compact mode) */}
      {!compact && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-contrast-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>Today's Hydration Logs ({waterLog.history.length})</span>
            </h4>
            <span className="text-xs text-contrast-muted font-medium">
              Total: {formatWater(waterLog.currentMl)}
            </span>
          </div>

          {waterLog.history.length === 0 ? (
            <p className="text-xs text-contrast-muted text-center py-4 italic">
              No water logged yet today. Click any button above to record your first glass!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {waterLog.history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-contrast-heading capitalize">
                        {entry.containerType}
                      </p>
                      <p className="text-[10px] text-contrast-muted">{entry.timestamp}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sky-600 dark:text-sky-400 tabular-numbers">
                    +{formatWater(entry.amountMl)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
