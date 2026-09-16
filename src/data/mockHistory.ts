import { WorkoutSession, HeartRatePoint } from '../types';

export const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: 'wo_1',
    type: 'run',
    title: 'Morning Park Interval Run',
    date: 'Today, 06:45 AM',
    durationSeconds: 1860, // 31 mins
    distanceKm: 5.2,
    steps: 6100,
    avgPaceMinPerKm: 5.96, // 5'57" /km
    calories: 385,
    avgHeartRate: 148,
    maxHeartRate: 172,
    elevationGainM: 42,
  },
  {
    id: 'wo_2',
    type: 'walk',
    title: 'Lunchtime Brisk Walk',
    date: 'Yesterday, 12:30 PM',
    durationSeconds: 1500, // 25 mins
    distanceKm: 2.4,
    steps: 3200,
    avgPaceMinPerKm: 10.4, // 10'24" /km
    calories: 125,
    avgHeartRate: 98,
    maxHeartRate: 114,
    elevationGainM: 15,
  },
  {
    id: 'wo_3',
    type: 'run',
    title: 'Sunset Lake Tempo Run',
    date: '2 days ago',
    durationSeconds: 2700, // 45 mins
    distanceKm: 7.8,
    steps: 9240,
    avgPaceMinPerKm: 5.76, // 5'45" /km
    calories: 590,
    avgHeartRate: 156,
    maxHeartRate: 178,
    elevationGainM: 65,
  },
  {
    id: 'wo_4',
    type: 'walk',
    title: 'Evening Neighborhood Walk',
    date: '3 days ago',
    durationSeconds: 2100, // 35 mins
    distanceKm: 3.1,
    steps: 4100,
    avgPaceMinPerKm: 11.2,
    calories: 160,
    avgHeartRate: 92,
    maxHeartRate: 105,
    elevationGainM: 20,
  },
];

export const INITIAL_HEART_RATE_HISTORY: HeartRatePoint[] = [
  { time: '00:00', bpm: 58 },
  { time: '02:00', bpm: 54 },
  { time: '04:00', bpm: 52 },
  { time: '06:00', bpm: 62 },
  { time: '06:45', bpm: 152 }, // Morning run
  { time: '07:30', bpm: 85 },
  { time: '09:00', bpm: 72 },
  { time: '11:00', bpm: 76 },
  { time: '12:30', bpm: 98 }, // Brisk walk
  { time: '14:00', bpm: 74 },
  { time: '16:00', bpm: 70 },
  { time: '18:00', bpm: 75 },
  { time: '20:00', bpm: 68 },
  { time: '22:00', bpm: 62 },
];

export interface DayActivityHistory {
  date: string;
  dayName: string;
  waterMl: number;
  steps: number;
  walkKm: number;
  runKm: number;
  caloriesBurned: number;
  avgBpm: number;
  restingBpm: number;
}

export const INITIAL_7_DAY_ACTIVITY: DayActivityHistory[] = [
  { date: '2026-09-09', dayName: 'Wed', waterMl: 2800, steps: 10200, walkKm: 4.2, runKm: 3.5, caloriesBurned: 540, avgBpm: 76, restingBpm: 58 },
  { date: '2026-09-10', dayName: 'Thu', waterMl: 2400, steps: 8300, walkKm: 5.5, runKm: 0.0, caloriesBurned: 390, avgBpm: 72, restingBpm: 59 },
  { date: '2026-09-11', dayName: 'Fri', waterMl: 3000, steps: 12800, walkKm: 4.0, runKm: 5.2, caloriesBurned: 650, avgBpm: 82, restingBpm: 57 },
  { date: '2026-09-12', dayName: 'Sat', waterMl: 2900, steps: 14200, walkKm: 6.8, runKm: 4.5, caloriesBurned: 710, avgBpm: 80, restingBpm: 56 },
  { date: '2026-09-13', dayName: 'Sun', waterMl: 2500, steps: 7600, walkKm: 5.1, runKm: 0.0, caloriesBurned: 350, avgBpm: 69, restingBpm: 58 },
  { date: '2026-09-14', dayName: 'Mon', waterMl: 2850, steps: 10450, walkKm: 4.5, runKm: 3.2, caloriesBurned: 520, avgBpm: 75, restingBpm: 57 },
  { date: '2026-09-15', dayName: 'Tue', waterMl: 2250, steps: 8750, walkKm: 3.8, runKm: 5.2, caloriesBurned: 490, avgBpm: 78, restingBpm: 56 },
];
