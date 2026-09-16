import React, { useState } from 'react';
import {
  Footprints,
  Play,
  Pause,
  Square,
  Flame,
  Clock,
  Timer,
  TrendingUp,
  MapPin,
  Heart,
  Plus,
  Compass,
  ArrowUpRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkoutType } from '../types';

export const WalkAndRunTracker: React.FC = () => {
  const {
    dailySteps,
    stepGoal,
    walkDistanceKm,
    runDistanceKm,
    activeMinutes,
    caloriesBurnedToday,
    workouts,
    activeWorkout,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    cancelWorkout,
    addManualSteps,
    formatDistance,
    formatPace,
    t,
  } = useApp();

  const [selectedType, setSelectedType] = useState<WorkoutType>('run');

  const stepProgress = Math.min(Math.round((dailySteps / (stepGoal || 10000)) * 100), 100);
  const totalDistanceKm = Number((walkDistanceKm + runDistanceKm).toFixed(2));

  // Format seconds to mm:ss or hh:mm:ss
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Daily Progress Card */}
      <div className="surface-card p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-contrast-heading">
                {t('walkAndRun')}
              </h2>
              <p className="text-xs sm:text-sm text-contrast-muted mt-0.5">
                Daily pedometer, real-time outdoor GPS pacing, and workout history.
              </p>
            </div>
          </div>

          {/* Step Goal Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Step Goal: {(stepGoal ?? 10000).toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Daily Core Walking & Running Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
          {/* Daily Steps */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-semibold text-contrast-muted mb-1">
              <span>{t('stepsToday')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{stepProgress}%</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-contrast-heading tabular-numbers">
              {(dailySteps ?? 0).toLocaleString()}
            </p>
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mt-3">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          {/* Total Distance (Walk + Run) */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-semibold text-contrast-muted mb-1">
              <span>{t('distance')}</span>
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-contrast-heading tabular-numbers">
              {formatDistance(totalDistanceKm)}
            </p>
            <p className="text-[11px] text-contrast-muted mt-2 font-medium">
              Walk: <span className="font-bold text-contrast-heading">{formatDistance(walkDistanceKm)}</span> • Run: <span className="font-bold text-contrast-heading">{formatDistance(runDistanceKm)}</span>
            </p>
          </div>

          {/* Active Calories Burned */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-semibold text-contrast-muted mb-1">
              <span>{t('caloriesBurned')}</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-numbers">
              {caloriesBurnedToday} <span className="text-sm font-semibold text-contrast-muted">kcal</span>
            </p>
            <p className="text-[11px] text-contrast-muted mt-2">
              From continuous movement & workouts
            </p>
          </div>

          {/* Active Exercise Time */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-semibold text-contrast-muted mb-1">
              <span>{t('activeMinutes')}</span>
              <Timer className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 tabular-numbers">
              {activeMinutes} <span className="text-sm font-semibold text-contrast-muted">min</span>
            </p>
            <p className="text-[11px] text-contrast-muted mt-2">
              Brisk cadence ≥100 SPM
            </p>
          </div>
        </div>

        {/* Quick Step Bump Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-bold text-contrast-muted flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Quick Add Steps:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addManualSteps(500)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-contrast-heading transition-colors cursor-pointer"
            >
              +500 steps
            </button>
            <button
              onClick={() => addManualSteps(1000)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-contrast-heading transition-colors cursor-pointer"
            >
              +1,000 steps
            </button>
            <button
              onClick={() => addManualSteps(2500)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300/40 transition-colors cursor-pointer"
            >
              +2,500 steps
            </button>
          </div>
        </div>
      </div>

      {/* LIVE WORKOUT CONTROLLER & ACTIVE HUD */}
      <div className="surface-card p-5 sm:p-7">
        {!activeWorkout ? (
          /* START WORKOUT LAUNCHER */
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <Zap className="w-3.5 h-3.5" />
                Live Workout Session
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-contrast-heading">
                Ready to go for a Walk or Run?
              </h3>
              <p className="text-xs sm:text-sm text-contrast-muted max-w-xl leading-relaxed">
                Track your real-time distance, pacing (min/km), cadence stride, active heart rate, and estimated calorie burn with live updates.
              </p>
            </div>

            {/* Mode Select & Start Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedType('walk')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === 'walk'
                      ? 'bg-white dark:bg-zinc-900 text-contrast-heading shadow-xs'
                      : 'text-contrast-muted hover:text-contrast-heading'
                  }`}
                >
                  🚶 Walking
                </button>
                <button
                  onClick={() => setSelectedType('run')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === 'run'
                      ? 'bg-white dark:bg-zinc-900 text-contrast-heading shadow-xs'
                      : 'text-contrast-muted hover:text-contrast-heading'
                  }`}
                >
                  🏃 Running
                </button>
              </div>

              <button
                id="start-workout-btn"
                onClick={() => startWorkout(selectedType)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start {selectedType === 'run' ? 'Running' : 'Walking'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE WORKOUT HUD SCREEN */
          <div className="space-y-6">
            {/* Live Indicator Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <h3 className="text-lg font-black text-contrast-heading uppercase tracking-wide">
                  Live {activeWorkout.type === 'run' ? 'Running' : 'Walking'} Workout
                </h3>
                {activeWorkout.isPaused && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    PAUSED
                  </span>
                )}
              </div>

              {/* Heart rate during workout */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs tabular-numbers">
                <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                <span>{activeWorkout.currentBpm} BPM</span>
              </div>
            </div>

            {/* Central Giant HUD Timer & Distance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center py-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-contrast-muted">
                  Duration
                </span>
                <p className="text-4xl sm:text-5xl font-black text-contrast-heading tabular-numbers mt-1">
                  {formatTimer(activeWorkout.elapsedSeconds)}
                </p>
              </div>

              <div className="md:border-x border-zinc-200 dark:border-zinc-800 md:px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-contrast-muted">
                  Distance
                </span>
                <p className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tabular-numbers mt-1">
                  {formatDistance(activeWorkout.distanceKm)}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-contrast-muted">
                  Current Pace
                </span>
                <p className="text-4xl sm:text-5xl font-black text-contrast-heading tabular-numbers mt-1">
                  {formatPace(activeWorkout.currentPaceMinPerKm)}
                </p>
              </div>
            </div>

            {/* Secondary telemetry: Steps, Calories, Cadence */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-contrast-muted">Steps</span>
                <p className="text-xl font-bold text-contrast-heading tabular-numbers mt-0.5">
                  {(activeWorkout.steps ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-contrast-muted">Calories</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-numbers mt-0.5">
                  {activeWorkout.calories} kcal
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-contrast-muted">Cadence</span>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-numbers mt-0.5">
                  {activeWorkout.type === 'run' ? '164 SPM' : '112 SPM'}
                </p>
              </div>
            </div>

            {/* Active Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {activeWorkout.isPaused ? (
                <button
                  onClick={resumeWorkout}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t('resumeWorkout')}</span>
                </button>
              ) : (
                <button
                  onClick={pauseWorkout}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-white shadow-md cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{t('pauseWorkout')}</span>
                </button>
              )}

              <button
                onClick={finishWorkout}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-md cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>{t('finishWorkout')}</span>
              </button>

              <button
                onClick={cancelWorkout}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WORKOUT LOGS & RECENT SESSIONS */}
      <div className="surface-card p-5 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <h3 className="text-lg font-bold text-contrast-heading flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Completed Walks & Runs ({workouts.length})</span>
          </h3>
          <span className="text-xs text-contrast-muted">
            Last 30 Days
          </span>
        </div>

        {workouts.length === 0 ? (
          <p className="text-xs text-contrast-muted text-center py-6">
            No completed workouts recorded yet. Start your first walk or run above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.map((wo) => {
              const isRun = wo.type === 'run';
              return (
                <div
                  key={wo.id}
                  className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isRun
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        }`}
                      >
                        {isRun ? '🏃' : '🚶'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-contrast-heading">{wo.title}</h4>
                        <p className="text-[11px] text-contrast-muted">{wo.date}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isRun
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      {wo.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 text-center border-t border-zinc-200/60 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] text-contrast-muted">Dist</span>
                      <p className="text-xs font-bold text-contrast-heading tabular-numbers">
                        {formatDistance(wo.distanceKm)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-contrast-muted">Time</span>
                      <p className="text-xs font-bold text-contrast-heading tabular-numbers">
                        {formatTimer(wo.durationSeconds)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-contrast-muted">Pace</span>
                      <p className="text-xs font-bold text-contrast-heading tabular-numbers">
                        {formatPace(wo.avgPaceMinPerKm)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-contrast-muted">Avg HR</span>
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-numbers">
                        {wo.avgHeartRate} bpm
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
