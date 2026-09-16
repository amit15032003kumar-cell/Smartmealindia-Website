import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Activity,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Info,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeartRateZone } from '../types';

export const HeartbeatMonitor: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    heartMetrics,
    isMeasuringPulse,
    measurePulse,
    isAudioHeartbeatEnabled,
    toggleAudioHeartbeat,
    logManualBpm,
    t,
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 520, height: 120 });
  const [customBpmInput, setCustomBpmInput] = useState<string>((heartMetrics?.currentBpm ?? 72).toString());
  const [isEditingBpm, setIsEditingBpm] = useState<boolean>(false);

  // ResizeObserver for responsive canvas scaling across smartphones, tablets, laptops, and desktops
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setCanvasDimensions({
            width: Math.floor(width),
            height: 120,
          });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const currentBpm = heartMetrics?.currentBpm ?? 72;
  const pulseDurationSec = Math.max(0.35, 60 / Math.max(40, currentBpm));

  // Determine current Heart Rate Zone
  const getZone = (bpm: number): { zone: HeartRateZone; label: string; color: string; desc: string } => {
    if (bpm < 60) {
      return { zone: 'resting', label: 'Resting Cardio', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-300', desc: 'Rest & recovery state' };
    }
    if (bpm < 100) {
      return { zone: 'light', label: 'Normal / Light', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300', desc: 'Daily baseline activity' };
    }
    if (bpm < 130) {
      return { zone: 'fat_burn', label: 'Fat Burn Zone', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300', desc: 'Aerobic energy efficiency' };
    }
    if (bpm < 160) {
      return { zone: 'cardio', label: 'Cardio / Aerobic', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-300', desc: 'Cardiovascular endurance' };
    }
    return { zone: 'peak', label: 'Peak Anaerobic', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-300', desc: 'Maximum performance effort' };
  };

  const zoneInfo = getZone(currentBpm);

  // Real-time medical ECG oscilloscope canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Clear canvas background with dark medical grid
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let prevX = 0;
    let prevY = midY;
    let phase = 0;

    const render = () => {
      // Clear a 12px scan-bar ahead of the drawing cursor
      ctx.fillStyle = '#09090b';
      ctx.fillRect((x + 1) % width, 0, 14, height);

      // Sub-grid redraw in the cleared swath
      ctx.strokeStyle = '#1f1f23';
      ctx.lineWidth = 1;
      const scanCol = Math.floor((x + 1) % width);
      if (scanCol % 20 === 0) {
        ctx.beginPath();
        ctx.moveTo(scanCol, 0);
        ctx.lineTo(scanCol, height);
        ctx.stroke();
      }

      // Calculate ECG P-Q-R-S-T wave point
      // Speed scales with currentBpm
      const cycleLength = Math.max(60, Math.round(18000 / currentBpm));
      const posInCycle = phase % cycleLength;
      let yOffset = 0;

      if (posInCycle > 15 && posInCycle < 35) {
        // P-wave (atrial depolarization)
        yOffset = -Math.sin(((posInCycle - 15) / 20) * Math.PI) * 7;
      } else if (posInCycle >= 40 && posInCycle < 44) {
        // Q-dip
        yOffset = 5;
      } else if (posInCycle >= 44 && posInCycle < 52) {
        // R-spike (ventricular depolarization)
        yOffset = -36;
      } else if (posInCycle >= 52 && posInCycle < 58) {
        // S-dip
        yOffset = 14;
      } else if (posInCycle >= 70 && posInCycle < 95) {
        // T-wave (ventricular repolarization)
        yOffset = -Math.sin(((posInCycle - 70) / 25) * Math.PI) * 11;
      } else {
        // Isoelectric baseline with tiny organic micro-noise
        yOffset = (Math.random() - 0.5) * 1.5;
      }

      const currY = midY + yOffset;

      // Draw glowing ECG line
      ctx.strokeStyle = '#10b981'; // Emerald/medical green
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, currY);
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      prevX = x;
      prevY = currY;
      x = (x + 2) % width;
      if (x < prevX) {
        prevX = 0;
      }
      phase++;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [currentBpm, canvasDimensions.width]);

  const handleSaveBpm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customBpmInput, 10);
    if (!isNaN(val) && val >= 40 && val <= 220) {
      logManualBpm(val);
      setIsEditingBpm(false);
    }
  };

  return (
    <div className="surface-card p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-contrast-heading">
                {t('heartHealth')}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{heartMetrics.rhythmStatus}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-contrast-muted mt-0.5">
              Live optical PPG waveform, heart rate variability, and biometric zones.
            </p>
          </div>
        </div>

        {/* Audio Heartbeat & Manual Input Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudioHeartbeat}
            id="heartbeat-audio-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isAudioHeartbeatEnabled
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-contrast-body border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
            }`}
            title="Listen to real-time synchronized heartbeat sound"
          >
            {isAudioHeartbeatEnabled ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>{t('hearHeartbeat')} (ON)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Audio Pulse (Muted)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center Heartbeat Display & ECG Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Dynamic Pulsing Heart Graphic with Live Readout */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-center relative overflow-hidden">
          {/* Pulsing Concentric Ripple Rings */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer Ripple */}
            <div
              className="absolute w-36 h-36 rounded-full bg-rose-500/10 dark:bg-rose-500/15"
              style={{
                animation: `ping ${pulseDurationSec * 1.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
              }}
            />
            {/* Inner Glow Ring */}
            <div
              className="absolute w-28 h-28 rounded-full bg-rose-500/20 dark:bg-rose-500/25"
              style={{
                animation: `pulse ${pulseDurationSec}s ease-in-out infinite`,
              }}
            />

            {/* Pulsing Heart Icon */}
            <div
              className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/40"
              style={{
                transform: 'scale(1)',
                animation: `heartbeatAnimation ${pulseDurationSec}s ease-in-out infinite`,
              }}
            >
              <Heart className="w-10 h-10 fill-white drop-shadow-md" />
            </div>
          </div>

          <style>{`
            @keyframes heartbeatAnimation {
              0%, 100% { transform: scale(1); }
              15% { transform: scale(1.18); }
              30% { transform: scale(1.05); }
              45% { transform: scale(1.14); }
              60% { transform: scale(1); }
            }
          `}</style>

          {/* Large BPM Numbers */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-5xl font-black text-contrast-heading tabular-numbers">
              {currentBpm}
            </span>
            <span className="text-sm font-bold text-contrast-muted uppercase tracking-wider">
              BPM
            </span>
          </div>

          {/* Current Heart Zone Badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${zoneInfo.color}`}>
              <span>{zoneInfo.label}</span>
            </span>
            <p className="text-[11px] text-contrast-muted mt-1">{zoneInfo.desc}</p>
          </div>

          {/* Measure Pulse Now Button */}
          <div className="mt-5 w-full">
            <button
              onClick={() => measurePulse()}
              disabled={isMeasuringPulse}
              id="measure-pulse-btn"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white shadow-sm shadow-rose-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMeasuringPulse ? 'animate-spin' : ''}`} />
              <span>{isMeasuringPulse ? t('measuringPulse') : t('measurePulseNow')}</span>
            </button>
          </div>
        </div>

        {/* Right: Real-Time Oscilloscope ECG Screen & Telemetry */}
        <div className="lg:col-span-7 space-y-4">
          {/* ECG Monitor Screen */}
          <div className="rounded-2xl bg-zinc-950 border-2 border-zinc-800 p-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 mb-2 px-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>LEAD II • ECG PULSE TRACE (25 mm/s)</span>
              </span>
              <span className="text-zinc-500 tabular-numbers">
                HR: {currentBpm} bpm • ST: 0.02mV
              </span>
            </div>

            {/* Canvas waveform */}
            <div ref={canvasContainerRef} className="w-full overflow-hidden rounded-xl bg-black">
              <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                className="w-full h-28 object-cover block"
              />
            </div>
          </div>

          {/* Metrics Grid: Resting, Min/Max, HRV */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            {/* Resting BPM */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-contrast-muted">Resting HR</span>
              <p className="text-xl font-black text-contrast-heading tabular-numbers mt-0.5">
                {heartMetrics.restingBpm} <span className="text-xs font-medium text-contrast-muted">bpm</span>
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Excellent</span>
            </div>

            {/* Min Today */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-contrast-muted">Min Today</span>
              <p className="text-xl font-black text-contrast-heading tabular-numbers mt-0.5">
                {heartMetrics.minTodayBpm} <span className="text-xs font-medium text-contrast-muted">bpm</span>
              </p>
              <span className="text-[10px] text-contrast-muted">Sleep reading</span>
            </div>

            {/* Max Today */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-contrast-muted">Max Today</span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 tabular-numbers mt-0.5">
                {heartMetrics.maxTodayBpm} <span className="text-xs font-medium text-contrast-muted">bpm</span>
              </p>
              <span className="text-[10px] text-contrast-muted">During run</span>
            </div>

            {/* HRV */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-contrast-muted">HRV (RMSSD)</span>
              <p className="text-xl font-black text-teal-600 dark:text-teal-400 tabular-numbers mt-0.5">
                {heartMetrics.hrvMs} <span className="text-xs font-medium text-contrast-muted">ms</span>
              </p>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Optimal Recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heart Rate Zones Visual Breakdown (if not compact) */}
      {!compact && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-contrast-heading flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-500" />
              <span>{t('heartRateZones')} Distribution</span>
            </h4>
            <span className="text-xs text-contrast-muted">Max HR: 191 bpm (Age 29)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {[
              { name: 'Resting', range: '<60 bpm', color: 'bg-sky-500', isCurrent: currentBpm < 60 },
              { name: 'Light/Warmup', range: '60-99 bpm', color: 'bg-emerald-500', isCurrent: currentBpm >= 60 && currentBpm < 100 },
              { name: 'Fat Burn', range: '100-129 bpm', color: 'bg-amber-500', isCurrent: currentBpm >= 100 && currentBpm < 130 },
              { name: 'Cardio', range: '130-159 bpm', color: 'bg-rose-500', isCurrent: currentBpm >= 130 && currentBpm < 160 },
              { name: 'Peak Effort', range: '160+ bpm', color: 'bg-purple-500', isCurrent: currentBpm >= 160 },
            ].map((z, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  z.isCurrent
                    ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-contrast-heading">{z.name}</span>
                  {z.isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-contrast-muted font-medium">{z.range}</p>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mt-2">
                  <div className={`h-full ${z.color} w-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
