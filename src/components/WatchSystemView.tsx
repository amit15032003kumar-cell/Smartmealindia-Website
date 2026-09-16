import React, { useState, useEffect } from 'react';
import {
  Watch,
  BatteryCharging,
  RotateCw,
  Wifi,
  Droplets,
  Heart,
  Footprints,
  Play,
  ShieldCheck,
  Bell,
  Check,
  Sliders,
  Sparkles,
  Smartphone,
  Radio,
  Lock,
  Unlock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WatchFaceStyle, WatchBandColor, WatchModel } from '../types';

export const WatchSystemView: React.FC = () => {
  const {
    watchDevice,
    updateWatchDevice,
    syncWatch,
    setWatchFace,
    setWatchBand,
    toggleWaterLock,
    triggerWatchAction,
    waterLog,
    dailySteps,
    stepGoal,
    heartMetrics,
    activeWorkout,
    formatWater,
    t,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Clock for the virtual watch
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const watchModels: { id: WatchModel; name: string; brand: string }[] = [
    { id: 'pixel_watch', name: 'Google Pixel Watch 3', brand: 'Google' },
    { id: 'apple_watch', name: 'Apple Watch Ultra 2', brand: 'Apple' },
    { id: 'galaxy_watch', name: 'Samsung Galaxy Watch 6', brand: 'Samsung' },
    { id: 'garmin', name: 'Garmin Forerunner 965', brand: 'Garmin' },
  ];

  const watchFaces: { id: WatchFaceStyle; label: string; icon: string; desc: string }[] = [
    { id: 'sport', label: 'Sport Rings', icon: '🏃', desc: 'Steps, live heart pulse, hydration' },
    { id: 'ecg', label: 'ECG Pulse', icon: '❤️', desc: 'Real-time cardiac wave monitor' },
    { id: 'water', label: 'Hydration Glance', icon: '💧', desc: 'Circular water fluid fill & quick drink' },
    { id: 'runner', label: 'Runner Chrono', icon: '⚡', desc: 'Pace, cadence, workout chronograph' },
    { id: 'minimal', label: 'Minimalist Digital', icon: '⌚', desc: 'Clean typography, date & battery' },
  ];

  const bandColors: { id: WatchBandColor; label: string; hex: string; styleClass: string }[] = [
    { id: 'obsidian', label: 'Obsidian Matte', hex: '#18181b', styleClass: 'bg-zinc-900 border-zinc-700' },
    { id: 'ocean', label: 'Ocean Blue', hex: '#0284c7', styleClass: 'bg-sky-600 border-sky-400' },
    { id: 'crimson', label: 'Crimson Sport', hex: '#e11d48', styleClass: 'bg-rose-600 border-rose-400' },
    { id: 'chalk', label: 'Chalk Stone', hex: '#e4e4e7', styleClass: 'bg-zinc-200 border-zinc-400' },
    { id: 'titanium', label: 'Titanium Link', hex: '#71717a', styleClass: 'bg-zinc-500 border-zinc-300' },
  ];

  const activeBand = bandColors.find((b) => b.id === watchDevice.bandColor) || bandColors[0];
  const stepPercent = Math.min(Math.round((dailySteps / (stepGoal || 10000)) * 100), 100);
  const waterPercent = Math.min(Math.round((waterLog.currentMl / (waterLog.goalMl || 2800)) * 100), 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="surface-card p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
              <Watch className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-contrast-heading">
                  {t('watchSystem')}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                  <Wifi className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-contrast-muted mt-0.5">
                Wearable companion system synchronizing water intake, walking & running, and heart rate telemetry.
              </p>
            </div>
          </div>

          {/* Sync Button & Battery */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-contrast-heading">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              <span>{watchDevice.batteryPercent}%</span>
            </div>

            <button
              onClick={() => syncWatch()}
              disabled={watchDevice.isSyncing}
              id="sync-watch-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white shadow-sm shadow-teal-600/30 transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${watchDevice.isSyncing ? 'animate-spin' : ''}`} />
              <span>{watchDevice.isSyncing ? t('syncing') : t('syncNow')}</span>
            </button>
          </div>
        </div>

        {/* Two-Column Interactive Layout: Virtual Smartwatch on Left, Watch Settings on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          {/* LEFT: INTERACTIVE VIRTUAL SMARTWATCH DEVICE */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* Top Strap Piece */}
            <div
              className={`w-28 sm:w-32 h-14 rounded-t-xl transition-all duration-300 border-x-2 border-t-2 shadow-inner`}
              style={{ backgroundColor: activeBand.hex }}
            />

            {/* Smartwatch Circular Chassis */}
            <div className="relative flex items-center justify-center">
              {/* Outer Watch Bezel Case */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-600 p-2.5 shadow-2xl ring-4 ring-black/40 relative flex items-center justify-center">
                {/* Physical Digital Crown on Right */}
                <div className="absolute -right-3 top-1/2 -translate-y-8 w-3 h-8 bg-zinc-400 rounded-r-md border border-zinc-600 shadow-md cursor-pointer hover:bg-zinc-300" title="Digital Crown" />
                {/* Secondary Button on Right */}
                <div className="absolute -right-2 top-1/2 translate-y-6 w-2 h-6 bg-zinc-500 rounded-r-sm cursor-pointer hover:bg-zinc-400" title="Side Button" />

                {/* Inner Bezel Ring */}
                <div className="w-full h-full rounded-full bg-black border-2 border-zinc-900 p-2 relative overflow-hidden flex flex-col items-center justify-between text-white select-none">
                  {/* Glass Glare Reflection */}
                  <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />

                  {/* Top Status Bar: Time & Connectivity */}
                  <div className="w-full pt-1.5 px-6 flex items-center justify-between text-[11px] font-bold text-zinc-400 z-10">
                    <span className="tabular-numbers">{currentTime.slice(0, 5)}</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      {watchDevice.waterLock && <Lock className="w-2.5 h-2.5 text-sky-400" />}
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      <span className="text-zinc-300 font-semibold">{watchDevice.batteryPercent}%</span>
                    </div>
                  </div>

                  {/* WATCH FACE DYNAMIC CENTER DISPLAY */}
                  <div className="flex-1 w-full flex flex-col items-center justify-center px-4 z-10 text-center">
                    {/* FACE 1: SPORT RINGS */}
                    {watchDevice.activeFace === 'sport' && (
                      <div className="space-y-2 w-full">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-white tabular-numbers tracking-tight">
                            {currentTime.slice(0, 5)}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">{currentDate.slice(0, 3)}</span>
                        </div>

                        {/* Tri-metric Complications */}
                        <div className="grid grid-cols-3 gap-1 px-2">
                          {/* BPM Pulse */}
                          <button
                            onClick={() => triggerWatchAction('pulse')}
                            className="p-1 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/60 transition-colors cursor-pointer"
                            title="Tap to check heart rate"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-auto animate-pulse" />
                            <span className="text-xs font-bold text-white block tabular-numbers mt-0.5">
                              {heartMetrics.currentBpm}
                            </span>
                            <span className="text-[9px] text-zinc-400 block uppercase">BPM</span>
                          </button>

                          {/* Steps */}
                          <button
                            onClick={() => triggerWatchAction('walk')}
                            className="p-1 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/60 transition-colors cursor-pointer"
                            title="Tap to view steps or start walk"
                          >
                            <Footprints className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                            <span className="text-xs font-bold text-white block tabular-numbers mt-0.5">
                              {dailySteps > 999 ? `${(dailySteps / 1000).toFixed(1)}k` : dailySteps}
                            </span>
                            <span className="text-[9px] text-zinc-400 block uppercase">Steps</span>
                          </button>

                          {/* Water */}
                          <button
                            onClick={() => triggerWatchAction('water')}
                            className="p-1 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/60 transition-colors cursor-pointer"
                            title="Tap to add +250ml water"
                          >
                            <Droplets className="w-3.5 h-3.5 text-sky-400 fill-sky-400 mx-auto" />
                            <span className="text-xs font-bold text-white block tabular-numbers mt-0.5">
                              {waterPercent}%
                            </span>
                            <span className="text-[9px] text-zinc-400 block uppercase">+250ml</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* FACE 2: ECG PULSE */}
                    {watchDevice.activeFace === 'ecg' && (
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-center gap-1.5">
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                          <span className="text-3xl font-black text-white tabular-numbers">
                            {heartMetrics.currentBpm}
                          </span>
                          <span className="text-xs font-bold text-zinc-400">BPM</span>
                        </div>
                        {/* Pulse Mini Wave Graphic */}
                        <div className="w-full h-8 flex items-center justify-center text-emerald-400">
                          <svg className="w-36 h-8" viewBox="0 0 100 24" fill="none">
                            <path
                              d="M0,12 L20,12 L24,6 L28,18 L32,2 L36,22 L40,12 L55,12 L60,8 L65,12 L100,12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Sinus Rhythm
                        </span>
                      </div>
                    )}

                    {/* FACE 3: HYDRATION GLANCE */}
                    {watchDevice.activeFace === 'water' && (
                      <div className="space-y-1.5 w-full">
                        <Droplets className="w-6 h-6 text-sky-400 fill-sky-400 mx-auto animate-bounce" />
                        <span className="text-2xl font-black text-white tabular-numbers">
                          {formatWater(waterLog.currentMl)}
                        </span>
                        <p className="text-[10px] text-sky-300 font-semibold">
                          Target: {formatWater(waterLog.goalMl)} ({waterPercent}%)
                        </p>
                        <button
                          onClick={() => triggerWatchAction('water')}
                          className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-sky-500 hover:bg-sky-400 text-white shadow-sm cursor-pointer"
                        >
                          +Drink 250ml
                        </button>
                      </div>
                    )}

                    {/* FACE 4: RUNNER CHRONO */}
                    {watchDevice.activeFace === 'runner' && (
                      <div className="space-y-1 w-full">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-400">
                          {activeWorkout?.isActive ? 'ACTIVE RUN' : 'READY TO RUN'}
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-white tabular-numbers">
                          {activeWorkout?.isActive ? `${activeWorkout.distanceKm.toFixed(2)} km` : '5.20 km'}
                        </p>
                        <p className="text-[11px] text-zinc-300 font-bold tabular-numbers">
                          Pace: {activeWorkout?.isActive ? `${activeWorkout.currentPaceMinPerKm}'/km` : "5'45\"/km"}
                        </p>
                        <button
                          onClick={() => triggerWatchAction('run')}
                          className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer shadow-sm"
                        >
                          {activeWorkout?.isActive ? 'Finish Run' : 'Start 5K Run'}
                        </button>
                      </div>
                    )}

                    {/* FACE 5: MINIMALIST DIGITAL */}
                    {watchDevice.activeFace === 'minimal' && (
                      <div className="space-y-1">
                        <p className="text-4xl font-black text-white tabular-numbers tracking-tighter">
                          {currentTime.slice(0, 5)}
                        </p>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                          {currentDate}
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-zinc-500">
                          <span>{(dailySteps ?? 0).toLocaleString()} st</span>
                          <span>•</span>
                          <span>{heartMetrics?.currentBpm ?? 72} bpm</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Quick Tap Action Bar on Watch */}
                  <div className="w-full pb-2 px-6 flex items-center justify-center gap-2 z-10">
                    <span className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">
                      Tap Tiles to Trigger
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Strap Piece */}
            <div
              className={`w-28 sm:w-32 h-14 rounded-b-xl transition-all duration-300 border-x-2 border-b-2 shadow-inner`}
              style={{ backgroundColor: activeBand.hex }}
            />
          </div>

          {/* RIGHT: WATCH CUSTOMIZATION, SENSORS & SYSTEM SETTINGS */}
          <div className="lg:col-span-6 space-y-5">
            {/* Watch Model Selector */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
              <label className="text-xs font-bold text-contrast-heading block mb-2">
                Paired Watch Device
              </label>
              <div className="grid grid-cols-2 gap-2">
                {watchModels.map((wm) => (
                  <button
                    key={wm.id}
                    onClick={() => updateWatchDevice({ model: wm.id, name: wm.name })}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      watchDevice.model === wm.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-contrast-heading font-bold'
                        : 'border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-contrast-muted hover:text-contrast-heading'
                    }`}
                  >
                    <span className="text-xs block font-bold leading-tight">{wm.name}</span>
                    <span className="text-[10px] text-contrast-muted block mt-0.5">{wm.brand} Companion</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Watch Face Selector */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
              <label className="text-xs font-bold text-contrast-heading block mb-2 flex items-center justify-between">
                <span>Choose Active Watch Face</span>
                <span className="text-[10px] text-contrast-muted capitalize">{watchDevice.activeFace}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {watchFaces.map((face) => (
                  <button
                    key={face.id}
                    onClick={() => setWatchFace(face.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      watchDevice.activeFace === face.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 font-bold text-contrast-heading ring-1 ring-teal-500/30'
                        : 'border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-contrast-muted hover:text-contrast-heading'
                    }`}
                  >
                    <span className="text-base mr-1">{face.icon}</span>
                    <span className="text-xs font-bold block mt-1">{face.label}</span>
                    <span className="text-[10px] text-contrast-muted block mt-0.5 line-clamp-1">{face.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Watch Strap / Band Color Customizer */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
              <label className="text-xs font-bold text-contrast-heading block mb-2">
                Watch Band Material & Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {bandColors.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setWatchBand(b.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      watchDevice.bandColor === b.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-contrast-heading ring-1 ring-teal-500/30'
                        : 'border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-contrast-muted'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: b.hex }}
                    />
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sensors & Companion Hardware Toggles */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
              <label className="text-xs font-bold text-contrast-heading block">
                Wearable Hardware & Sensor Status
              </label>

              <div className="space-y-2 text-xs">
                {/* Optical PPG Sensor */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <div>
                      <p className="font-bold text-contrast-heading">Optical PPG Heart Sensor</p>
                      <p className="text-[10px] text-contrast-muted">24/7 continuous cardiac monitoring</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>

                {/* 3-Axis Accelerometer */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="font-bold text-contrast-heading">3-Axis Motion Accelerometer</p>
                      <p className="text-[10px] text-contrast-muted">Pedometer, stride cadence & run velocity</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>

                {/* Water Lock Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <div>
                      <p className="font-bold text-contrast-heading">Water Lock Protection</p>
                      <p className="text-[10px] text-contrast-muted">Locks screen during swimming or rain</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleWaterLock}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      watchDevice.waterLock
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-contrast-muted'
                    }`}
                  >
                    {watchDevice.waterLock ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
