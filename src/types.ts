export type WorkoutType = 'walk' | 'run';

export interface WorkoutSession {
  id: string;
  type: WorkoutType;
  title: string;
  date: string;
  durationSeconds: number;
  distanceKm: number;
  steps: number;
  avgPaceMinPerKm: number; // e.g. 5.5 min/km
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  elevationGainM: number;
}

export interface WaterEntry {
  id: string;
  timestamp: string;
  amountMl: number;
  containerType: 'sip' | 'glass' | 'bottle' | 'tumbler' | 'custom';
}

export interface WaterLog {
  currentMl: number;
  goalMl: number;
  history: WaterEntry[];
  streakDays: number;
}

export type HeartRateZone = 'resting' | 'light' | 'fat_burn' | 'cardio' | 'peak';

export interface HeartRatePoint {
  time: string;
  bpm: number;
}

export interface HeartMetrics {
  currentBpm: number;
  restingBpm: number;
  minTodayBpm: number;
  maxTodayBpm: number;
  hrvMs: number; // Heart Rate Variability
  rhythmStatus: 'Normal Sinus Rhythm' | 'Elevated Rhythm' | 'Recovery Rhythm';
  history24h: HeartRatePoint[];
}

export type WatchModel = 'apple_watch' | 'pixel_watch' | 'galaxy_watch' | 'garmin';
export type WatchFaceStyle = 'sport' | 'ecg' | 'water' | 'runner' | 'minimal';
export type WatchBandColor = 'obsidian' | 'ocean' | 'crimson' | 'chalk' | 'titanium';

export interface WatchDevice {
  id: string;
  name: string;
  model: WatchModel;
  batteryPercent: number;
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: string;
  waterLock: boolean;
  heartSensorOn: boolean;
  accelerometerOn: boolean;
  activeFace: WatchFaceStyle;
  bandColor: WatchBandColor;
  notificationsEnabled: boolean;
  waterHourlyReminder: boolean;
  highBpmAlertThreshold: number;
}

export type UnitSystem = 'metric' | 'imperial';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  waterGoalMl: number;
  dailyStepGoal: number;
  stepGoal?: number;
  dailyRunDistanceGoalKm: number;
  unitSystem: UnitSystem;
  theme: ThemeMode;
  language: Language;
  notificationsEnabled: boolean;
  autoCloudBackup: boolean;
  lastCloudBackup: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'water' | 'workout' | 'heart' | 'watch' | 'system';
  read: boolean;
}
