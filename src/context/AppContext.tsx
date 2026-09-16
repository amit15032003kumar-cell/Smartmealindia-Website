import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  WorkoutType,
  WorkoutSession,
  WaterLog,
  WaterEntry,
  HeartMetrics,
  WatchDevice,
  WatchFaceStyle,
  WatchBandColor,
  UserProfile,
  AppNotification,
  Language,
  UnitSystem,
} from '../types';
import {
  INITIAL_WORKOUTS,
  INITIAL_HEART_RATE_HISTORY,
  INITIAL_7_DAY_ACTIVITY,
  DayActivityHistory,
} from '../data/mockHistory';
import { TRANSLATIONS } from '../localization/translations';

export interface ActiveWorkoutState {
  isActive: boolean;
  isPaused: boolean;
  type: WorkoutType;
  startTime: number;
  elapsedSeconds: number;
  distanceKm: number;
  steps: number;
  currentPaceMinPerKm: number;
  calories: number;
  currentBpm: number;
  elevationM: number;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Water tracking
  waterLog: WaterLog;
  addWater: (amountMl: number, containerType?: WaterEntry['containerType']) => void;
  resetWater: () => void;
  setWaterGoal: (newGoalMl: number) => void;
  hydrationStatus: 'optimal' | 'good' | 'moderate' | 'low';
  hydrationPercentage: number;

  // Walking & Running
  dailySteps: number;
  stepGoal: number;
  walkDistanceKm: number;
  runDistanceKm: number;
  activeMinutes: number;
  caloriesBurnedToday: number;
  workouts: WorkoutSession[];
  activeWorkout: ActiveWorkoutState | null;
  startWorkout: (type: WorkoutType) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  addManualSteps: (steps: number) => void;

  // Heart Rate & Heartbeat
  heartMetrics: HeartMetrics;
  isMeasuringPulse: boolean;
  measurePulse: () => Promise<number>;
  isAudioHeartbeatEnabled: boolean;
  toggleAudioHeartbeat: () => void;
  logManualBpm: (bpm: number) => void;

  // Watch System
  watchDevice: WatchDevice;
  updateWatchDevice: (updates: Partial<WatchDevice>) => void;
  syncWatch: () => Promise<void>;
  setWatchFace: (face: WatchFaceStyle) => void;
  setWatchBand: (color: WatchBandColor) => void;
  toggleWaterLock: () => void;
  triggerWatchAction: (action: 'water' | 'walk' | 'run' | 'pulse') => void;

  // User Profile
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Analytics & History
  weeklyActivity: DayActivityHistory[];

  // Notifications & Cloud
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline_cached';
  lastCloudSyncTime: string;
  backupToCloud: () => Promise<void>;
  exportBackupJson: () => void;
  restoreBackupJson: (jsonString: string) => void;

  // Formatting & Localization
  t: (key: string) => string;
  formatWater: (ml: number) => string;
  formatDistance: (km: number) => string;
  formatPace: (minPerKm: number) => string;
}

export const DEFAULT_CARTOON_AVATAR = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  avatarUrl: DEFAULT_CARTOON_AVATAR,
  email: 'alex.rivera@example.com',
  age: 29,
  gender: 'female',
  heightCm: 172,
  currentWeightKg: 68.5,
  targetWeightKg: 65.0,
  waterGoalMl: 2800,
  dailyStepGoal: 10000,
  stepGoal: 10000,
  dailyRunDistanceGoalKm: 5.0,
  unitSystem: 'metric',
  theme: 'dark',
  language: 'en',
  notificationsEnabled: true,
  autoCloudBackup: true,
  lastCloudBackup: 'Today at 09:30 AM',
};

const DEFAULT_WATER_LOG: WaterLog = {
  currentMl: 2150,
  goalMl: 2800,
  streakDays: 6,
  history: [
    { id: 'w_1', timestamp: '07:30 AM', amountMl: 500, containerType: 'bottle' },
    { id: 'w_2', timestamp: '09:45 AM', amountMl: 250, containerType: 'glass' },
    { id: 'w_3', timestamp: '11:15 AM', amountMl: 250, containerType: 'glass' },
    { id: 'w_4', timestamp: '01:00 PM', amountMl: 750, containerType: 'tumbler' },
    { id: 'w_5', timestamp: '03:15 PM', amountMl: 400, containerType: 'bottle' },
  ],
};

const DEFAULT_HEART_METRICS: HeartMetrics = {
  currentBpm: 72,
  restingBpm: 58,
  minTodayBpm: 52,
  maxTodayBpm: 172,
  hrvMs: 64,
  rhythmStatus: 'Normal Sinus Rhythm',
  history24h: INITIAL_HEART_RATE_HISTORY,
};

const DEFAULT_WATCH_DEVICE: WatchDevice = {
  id: 'watch_galaxy_06',
  name: 'Samsung Galaxy Watch 6',
  model: 'galaxy_watch',
  batteryPercent: 94,
  isConnected: true,
  isSyncing: false,
  lastSyncTime: 'Just now',
  waterLock: false,
  heartSensorOn: true,
  accelerometerOn: true,
  activeFace: 'sport',
  bandColor: 'obsidian',
  notificationsEnabled: true,
  waterHourlyReminder: true,
  highBpmAlertThreshold: 140,
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Hydration Target Near',
    message: 'You have logged 2,150 ml of water today. Just 650 ml more to hit your 2,800 ml goal!',
    time: '25 min ago',
    type: 'water',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Morning Run Completed',
    message: 'Great 5.2 km interval run logged! You achieved an average heart rate of 148 BPM.',
    time: '2 hours ago',
    type: 'workout',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Watch Synchronized',
    message: 'Pixel Watch 3 Pro synced 8,750 steps and optical heart rate metrics seamlessly.',
    time: '4 hours ago',
    type: 'watch',
    read: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Persistence loader
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const cached = localStorage.getItem('smi_fitness_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        const dailyStepGoal = parsed.dailyStepGoal ?? parsed.stepGoal ?? DEFAULT_PROFILE.dailyStepGoal;
        // If avatarUrl was the old girl photo or any unsplash photo, replace with cartoon avatar
        const isOldGirlPhoto =
          !parsed.avatarUrl ||
          parsed.avatarUrl.includes('photo-1534528741775-53994a69daeb') ||
          parsed.avatarUrl.includes('photo-');
        const avatarUrl = isOldGirlPhoto ? DEFAULT_CARTOON_AVATAR : parsed.avatarUrl;

        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          avatarUrl,
          dailyStepGoal,
          stepGoal: dailyStepGoal,
          waterGoalMl: parsed.waterGoalMl ?? DEFAULT_PROFILE.waterGoalMl,
          currentWeightKg: parsed.currentWeightKg ?? DEFAULT_PROFILE.currentWeightKg,
          targetWeightKg: parsed.targetWeightKg ?? DEFAULT_PROFILE.targetWeightKg,
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [waterLog, setWaterLog] = useState<WaterLog>(() => {
    try {
      const cached = localStorage.getItem('smi_water_log');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_WATER_LOG,
          ...parsed,
          goalMl: parsed.goalMl ?? DEFAULT_WATER_LOG.goalMl,
          currentMl: parsed.currentMl ?? 0,
          history: Array.isArray(parsed.history) ? parsed.history : DEFAULT_WATER_LOG.history,
        };
      }
      return DEFAULT_WATER_LOG;
    } catch {
      return DEFAULT_WATER_LOG;
    }
  });

  const [workouts, setWorkouts] = useState<WorkoutSession[]>(() => {
    try {
      const cached = localStorage.getItem('smi_workouts');
      return cached ? JSON.parse(cached) : INITIAL_WORKOUTS;
    } catch {
      return INITIAL_WORKOUTS;
    }
  });

  const [dailySteps, setDailySteps] = useState<number>(8750);
  const [walkDistanceKm, setWalkDistanceKm] = useState<number>(3.8);
  const [runDistanceKm, setRunDistanceKm] = useState<number>(5.2);
  const [activeMinutes, setActiveMinutes] = useState<number>(56);
  const [caloriesBurnedToday, setCaloriesBurnedToday] = useState<number>(490);

  // Active Live Workout Session
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const workoutIntervalRef = useRef<number | null>(null);

  // Heart Rate
  const [heartMetrics, setHeartMetrics] = useState<HeartMetrics>(() => {
    try {
      const cached = localStorage.getItem('smi_heart_metrics');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_HEART_METRICS,
          ...parsed,
          currentBpm: parsed.currentBpm ?? DEFAULT_HEART_METRICS.currentBpm,
        };
      }
      return DEFAULT_HEART_METRICS;
    } catch {
      return DEFAULT_HEART_METRICS;
    }
  });

  const [isMeasuringPulse, setIsMeasuringPulse] = useState<boolean>(false);
  const [isAudioHeartbeatEnabled, setIsAudioHeartbeatEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  // Watch Device
  const [watchDevice, setWatchDevice] = useState<WatchDevice>(() => {
    try {
      const cached = localStorage.getItem('smi_watch_device');
      if (cached) {
        const parsed = JSON.parse(cached);
        const name = parsed.name === 'Pixel Watch 3 Pro' ? 'Samsung Galaxy Watch 6' : (parsed.name ?? DEFAULT_WATCH_DEVICE.name);
        const model = parsed.model === 'pixel_watch' ? 'galaxy_watch' : (parsed.model ?? DEFAULT_WATCH_DEVICE.model);
        return {
          ...DEFAULT_WATCH_DEVICE,
          ...parsed,
          name,
          model,
        };
      }
      return DEFAULT_WATCH_DEVICE;
    } catch {
      return DEFAULT_WATCH_DEVICE;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline_cached'>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('Just now');
  const [weeklyActivity] = useState<DayActivityHistory[]>(INITIAL_7_DAY_ACTIVITY);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smi_fitness_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('smi_water_log', JSON.stringify(waterLog));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [waterLog]);

  useEffect(() => {
    try {
      localStorage.setItem('smi_workouts', JSON.stringify(workouts));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [workouts]);

  useEffect(() => {
    try {
      localStorage.setItem('smi_watch_device', JSON.stringify(watchDevice));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [watchDevice]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      userProfile.theme === 'dark' ||
      (userProfile.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userProfile.theme]);

  // Gentle pulse jitter to mimic real-time heart rate variation (e.g. 70-74 bpm)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isMeasuringPulse && !activeWorkout?.isActive) {
        setHeartMetrics((prev) => {
          // slight drift by +/- 1 or 2
          const drift = Math.floor(Math.random() * 3) - 1;
          const newBpm = Math.min(Math.max(prev.currentBpm + drift, 58), 95);
          return {
            ...prev,
            currentBpm: newBpm,
          };
        });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isMeasuringPulse, activeWorkout]);

  // Workout Session Timer loop
  useEffect(() => {
    if (activeWorkout?.isActive && !activeWorkout.isPaused) {
      workoutIntervalRef.current = window.setInterval(() => {
        setActiveWorkout((prev) => {
          if (!prev || prev.isPaused) return prev;
          const newElapsed = prev.elapsedSeconds + 1;
          const isRunning = prev.type === 'run';

          // Approx speeds: run ~ 10 km/h (~0.0028 km/s), walk ~ 5 km/h (~0.0014 km/s)
          const addedDistance = isRunning ? 0.0028 : 0.0014;
          const addedSteps = isRunning ? 2.8 : 1.7;
          const addedCalories = isRunning ? 0.21 : 0.08;

          const newDistance = Number((prev.distanceKm + addedDistance).toFixed(3));
          const newSteps = Math.round(prev.steps + addedSteps);
          const newCalories = Math.round(prev.calories + addedCalories);

          // Calculate current pace in min/km
          const pace = newDistance > 0.05 ? Number(((newElapsed / 60) / newDistance).toFixed(2)) : isRunning ? 5.5 : 10.0;

          // Target elevated heart rate during workout
          const targetWorkoutBpm = isRunning ? 152 + Math.floor(Math.random() * 8) : 104 + Math.floor(Math.random() * 6);

          return {
            ...prev,
            elapsedSeconds: newElapsed,
            distanceKm: newDistance,
            steps: newSteps,
            currentPaceMinPerKm: pace,
            calories: newCalories,
            currentBpm: targetWorkoutBpm,
          };
        });
      }, 1000);
    } else {
      if (workoutIntervalRef.current) {
        clearInterval(workoutIntervalRef.current);
        workoutIntervalRef.current = null;
      }
    }

    return () => {
      if (workoutIntervalRef.current) {
        clearInterval(workoutIntervalRef.current);
      }
    };
  }, [activeWorkout?.isActive, activeWorkout?.isPaused]);

  // Audio Heartbeat Sound Generator using Web Audio API
  const playLubDub = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // "Lub" sound (First heart sound, ~60Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // "Dub" sound (Second heart sound, slightly higher, ~90Hz, 160ms later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, now + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.26);

      gain2.gain.setValueAtTime(0.16, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.27);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isAudioHeartbeatEnabled) {
      const bpm = activeWorkout?.isActive ? activeWorkout.currentBpm : heartMetrics.currentBpm;
      const intervalMs = Math.max(300, (60 / bpm) * 1000);

      playLubDub();
      audioIntervalRef.current = window.setInterval(playLubDub, intervalMs);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isAudioHeartbeatEnabled, heartMetrics.currentBpm, activeWorkout?.currentBpm]);

  const toggleAudioHeartbeat = () => {
    setIsAudioHeartbeatEnabled((prev) => !prev);
  };

  // Water Actions
  const addWater = (amountMl: number, containerType: WaterEntry['containerType'] = 'glass') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setWaterLog((prev) => {
      const newCurrent = Math.max(0, prev.currentMl + amountMl);
      const newEntry: WaterEntry = {
        id: `w_${Date.now()}`,
        timestamp: timeStr,
        amountMl,
        containerType,
      };

      return {
        ...prev,
        currentMl: newCurrent,
        history: [newEntry, ...prev.history],
      };
    });

    if (amountMl > 0) {
      addNotification(
        'Water Logged',
        `Added +${amountMl} ml of water. Keep up the great hydration!`,
        'water'
      );
    }
  };

  const resetWater = () => {
    setWaterLog((prev) => ({
      ...prev,
      currentMl: 0,
      history: [],
    }));
  };

  const setWaterGoal = (newGoalMl: number) => {
    setWaterLog((prev) => ({
      ...prev,
      goalMl: Math.max(500, newGoalMl),
    }));
    setUserProfile((prev) => ({
      ...prev,
      waterGoalMl: newGoalMl,
    }));
  };

  // Hydration status evaluation: "water I good"
  const hydrationPercentage = Math.round((waterLog.currentMl / (waterLog.goalMl || 2800)) * 100);
  const hydrationStatus: 'optimal' | 'good' | 'moderate' | 'low' = useMemo(() => {
    if (hydrationPercentage >= 100) return 'optimal';
    if (hydrationPercentage >= 70) return 'good';
    if (hydrationPercentage >= 40) return 'moderate';
    return 'low';
  }, [hydrationPercentage]);

  // Workout Actions
  const startWorkout = (type: WorkoutType) => {
    const initialBpm = type === 'run' ? 128 : 88;
    setActiveWorkout({
      isActive: true,
      isPaused: false,
      type,
      startTime: Date.now(),
      elapsedSeconds: 0,
      distanceKm: 0,
      steps: 0,
      currentPaceMinPerKm: type === 'run' ? 5.6 : 10.2,
      calories: 0,
      currentBpm: initialBpm,
      elevationM: 0,
    });
    setHeartMetrics((prev) => ({ ...prev, currentBpm: initialBpm }));

    addNotification(
      `${type === 'run' ? 'Running' : 'Walking'} Workout Started`,
      `Live session running with real-time GPS pace, heart rate, and cadence tracking.`,
      'workout'
    );
  };

  const pauseWorkout = () => {
    setActiveWorkout((prev) => (prev ? { ...prev, isPaused: true } : null));
  };

  const resumeWorkout = () => {
    setActiveWorkout((prev) => (prev ? { ...prev, isPaused: false } : null));
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    const newWorkout: WorkoutSession = {
      id: `wo_${Date.now()}`,
      type: activeWorkout.type,
      title: `${activeWorkout.type === 'run' ? 'Running' : 'Walking'} Session`,
      date: 'Just now',
      durationSeconds: Math.max(1, activeWorkout.elapsedSeconds),
      distanceKm: Number(activeWorkout.distanceKm.toFixed(2)),
      steps: activeWorkout.steps,
      avgPaceMinPerKm: activeWorkout.currentPaceMinPerKm,
      calories: activeWorkout.calories,
      avgHeartRate: activeWorkout.currentBpm,
      maxHeartRate: Math.round(activeWorkout.currentBpm + 14),
      elevationGainM: 25,
    };

    setWorkouts((prev) => [newWorkout, ...prev]);

    // Update today's overall metrics
    setDailySteps((prev) => prev + activeWorkout.steps);
    setCaloriesBurnedToday((prev) => prev + activeWorkout.calories);
    if (activeWorkout.type === 'run') {
      setRunDistanceKm((prev) => Number((prev + activeWorkout.distanceKm).toFixed(2)));
    } else {
      setWalkDistanceKm((prev) => Number((prev + activeWorkout.distanceKm).toFixed(2)));
    }
    setActiveMinutes((prev) => prev + Math.round(activeWorkout.elapsedSeconds / 60));

    // Reset heart rate gradually back to normal
    setHeartMetrics((prev) => ({ ...prev, currentBpm: 76 }));

    addNotification(
      'Workout Saved!',
      `Finished ${activeWorkout.type}: ${activeWorkout.distanceKm.toFixed(2)} km, ${activeWorkout.calories} kcal burned. Excellent work!`,
      'workout'
    );

    setActiveWorkout(null);
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
    setHeartMetrics((prev) => ({ ...prev, currentBpm: 72 }));
  };

  const addManualSteps = (steps: number) => {
    setDailySteps((prev) => prev + steps);
    const addedDist = Number((steps * 0.00075).toFixed(2));
    setWalkDistanceKm((prev) => Number((prev + addedDist).toFixed(2)));
    setCaloriesBurnedToday((prev) => prev + Math.round(steps * 0.04));
  };

  // Heart Rate measurement optical sensor simulation
  const measurePulse = async (): Promise<number> => {
    setIsMeasuringPulse(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate realistic reading between 68 and 82
        const measured = 68 + Math.floor(Math.random() * 16);
        setHeartMetrics((prev) => ({
          ...prev,
          currentBpm: measured,
          rhythmStatus: 'Normal Sinus Rhythm',
          history24h: [
            ...prev.history24h,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              bpm: measured,
            },
          ],
        }));
        setIsMeasuringPulse(false);

        addNotification(
          'Heart Rate Reading Captured',
          `Resting optical sensor measured ${measured} BPM. Normal sinus rhythm detected.`,
          'heart'
        );

        resolve(measured);
      }, 3200);
    });
  };

  const logManualBpm = (bpm: number) => {
    setHeartMetrics((prev) => ({
      ...prev,
      currentBpm: bpm,
      minTodayBpm: Math.min(prev.minTodayBpm, bpm),
      maxTodayBpm: Math.max(prev.maxTodayBpm, bpm),
    }));
  };

  // Watch Device actions
  const updateWatchDevice = (updates: Partial<WatchDevice>) => {
    setWatchDevice((prev) => ({ ...prev, ...updates }));
  };

  const syncWatch = async () => {
    setWatchDevice((prev) => ({ ...prev, isSyncing: true }));
    setCloudSyncStatus('syncing');

    await new Promise((r) => setTimeout(r, 1200));

    const nowStr = 'Just now';
    setWatchDevice((prev) => ({
      ...prev,
      isSyncing: false,
      lastSyncTime: nowStr,
      batteryPercent: Math.max(20, prev.batteryPercent - 1),
    }));
    setCloudSyncStatus('synced');
    setLastCloudSyncTime(nowStr);

    addNotification(
      'Watch Synchronized',
      `${watchDevice.name} data has been synchronized with the website.`,
      'watch'
    );
  };

  const setWatchFace = (face: WatchFaceStyle) => {
    updateWatchDevice({ activeFace: face });
  };

  const setWatchBand = (bandColor: WatchBandColor) => {
    updateWatchDevice({ bandColor });
  };

  const toggleWaterLock = () => {
    updateWatchDevice({ waterLock: !watchDevice.waterLock });
  };

  const triggerWatchAction = (action: 'water' | 'walk' | 'run' | 'pulse') => {
    if (action === 'water') {
      addWater(250, 'glass');
    } else if (action === 'walk') {
      startWorkout('walk');
    } else if (action === 'run') {
      startWorkout('run');
    } else if (action === 'pulse') {
      measurePulse();
    }
  };

  // Profile update
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'system'
  ) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const backupToCloud = async () => {
    setCloudSyncStatus('syncing');
    await new Promise((r) => setTimeout(r, 900));
    setCloudSyncStatus('synced');
    setLastCloudSyncTime('Just now');
  };

  const exportBackupJson = () => {
    try {
      const backupData = {
        userProfile,
        waterLog,
        workouts,
        heartMetrics,
        watchDevice,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartmealindia_fitness_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('Data Backup Exported', 'Health and fitness backup JSON file generated successfully.', 'system');
    } catch (e) {
      console.error('Failed to export backup', e);
    }
  };

  const restoreBackupJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.userProfile) {
        setUserProfile({
          ...DEFAULT_PROFILE,
          ...data.userProfile,
          dailyStepGoal: data.userProfile.dailyStepGoal ?? data.userProfile.stepGoal ?? DEFAULT_PROFILE.dailyStepGoal,
          stepGoal: data.userProfile.dailyStepGoal ?? data.userProfile.stepGoal ?? DEFAULT_PROFILE.stepGoal,
          targetWeightKg: data.userProfile.targetWeightKg ?? DEFAULT_PROFILE.targetWeightKg,
        });
      }
      if (data.waterLog) {
        setWaterLog({
          ...DEFAULT_WATER_LOG,
          ...data.waterLog,
          goalMl: data.waterLog.goalMl ?? DEFAULT_WATER_LOG.goalMl,
          currentMl: data.waterLog.currentMl ?? 0,
        });
      }
      if (Array.isArray(data.workouts)) {
        setWorkouts(data.workouts);
      }
      if (data.heartMetrics) {
        setHeartMetrics({
          ...DEFAULT_HEART_METRICS,
          ...data.heartMetrics,
        });
      }
      if (data.watchDevice) {
        setWatchDevice({
          ...DEFAULT_WATCH_DEVICE,
          ...data.watchDevice,
        });
      }
      addNotification('Backup Restored', 'Your health metrics and fitness data have been restored successfully.', 'system');
    } catch (e) {
      console.error('Failed to restore backup', e);
      addNotification('Restore Failed', 'The selected JSON backup file could not be parsed.', 'system');
    }
  };

  // Translations
  const t = (key: string): string => {
    const lang = userProfile.language || 'en';
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const formatWater = (ml: number): string => {
    if (userProfile.unitSystem === 'imperial') {
      const flOz = Math.round(ml * 0.033814);
      return `${flOz} fl oz`;
    }
    return `${ml} ml`;
  };

  const formatDistance = (km: number): string => {
    if (userProfile.unitSystem === 'imperial') {
      const miles = (km * 0.621371).toFixed(2);
      return `${miles} mi`;
    }
    return `${km.toFixed(2)} km`;
  };

  const formatPace = (minPerKm: number): string => {
    const totalSec = Math.round(minPerKm * 60);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}'${s < 10 ? '0' : ''}${s}" /km`;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        waterLog,
        addWater,
        resetWater,
        setWaterGoal,
        hydrationStatus,
        hydrationPercentage,
        dailySteps,
        stepGoal: userProfile.dailyStepGoal ?? userProfile.stepGoal ?? 10000,
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
        heartMetrics,
        isMeasuringPulse,
        measurePulse,
        isAudioHeartbeatEnabled,
        toggleAudioHeartbeat,
        logManualBpm,
        watchDevice,
        updateWatchDevice,
        syncWatch,
        setWatchFace,
        setWatchBand,
        toggleWaterLock,
        triggerWatchAction,
        userProfile,
        updateProfile,
        weeklyActivity,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        cloudSyncStatus,
        lastCloudSyncTime,
        backupToCloud,
        exportBackupJson,
        restoreBackupJson,
        t,
        formatWater,
        formatDistance,
        formatPace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
