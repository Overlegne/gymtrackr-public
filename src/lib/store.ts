
import exercisesData from './exercises.json';
import { getSettings } from './settings-store';

/**
 * GYMTRACKR LOCAL-FIRST DATA LAYER
 * This file implements a durable asynchronous storage engine using IndexedDB.
 * Each device maintains its own isolated database. No cloud authentication required.
 */

// Types
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio';
export type Equipment = 'Dumbbell' | 'Barbell' | 'Machine' | 'Cable' | 'Bodyweight';
export type LoggingType = 'weight_reps' | 'duration';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  defaultSets: number;
  defaultReps: number;
  defaultDurationSeconds?: number;
  loggingType: LoggingType;
  imageUrl: string;
  imageNeedsReview?: boolean;
  secondaryMuscles?: string[];
  description?: string;
  cues?: string[];
  alternatives?: { name: string; id: string }[];
  mistakes?: string[];
}

export interface SetStats {
  weight: number;
  reps: number;
  durationSeconds?: number;
}

export interface ExerciseStats {
  sets: { [setIndex: string]: SetStats };
}

export interface HistoryPoint {
  date: string;
  weight: number;
  reps: number;
  durationSeconds?: number;
  sets: number;
  volume: number;
  e1RM: number;
}

export interface RoutineExercise extends Exercise {
  sets: {
    reps: number;
    weight: number;
    durationSeconds?: number;
    completed: boolean;
  }[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  color?: string;
  lastPerformed?: string;
}

export interface WorkoutLog {
  id: string;
  routineId: string;
  routineName: string;
  routineColor: string;
  date: string; // ISO YYYY-MM-DD
  totalVolume?: number;
  durationSeconds?: number;
}

export interface WorkoutSummaryData {
  routineName: string;
  routineColor: string;
  date: string;
  durationSeconds: number;
  totalVolume: number;
  totalSets: number;
  exerciseCount: number;
  muscleSplit: { muscle: MuscleGroup; count: number; percentage: number }[];
  exercises: {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: number;
    topWeight: number;
    topReps: number;
    volume: number;
    durationSeconds?: number;
    loggingType: LoggingType;
    records: string[];
  }[];
  globalRecords: string[];
}

export type PlateauStatus = 'Progressing' | 'Stable' | 'Plateau';

export interface PlateauAnalysis {
  status: PlateauStatus;
  reason: string;
  suggestions: string[];
}

export interface ProgressionSuggestion {
  type: 'increase_weight' | 'increase_reps' | 'increase_duration' | 'repeat' | 'deload';
  suggestedWeight?: number;
  suggestedReps?: number;
  suggestedDuration?: number;
  reason: string;
  lastStatsText: string;
}

// Storage Constants
const DB_NAME = 'gymtrackr_local_db';
const DB_VERSION = 1;
const STORES = {
  EXERCISES: 'exercises',
  ROUTINES: 'routines',
  STATS: 'exercise_stats',
  LOGS: 'workout_logs',
  HISTORY: 'exercise_history',
  SUMMARY: 'last_summary',
  ACTIVE_SESSION: 'active_session'
};

// IndexedDB Helper
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Not in browser');
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, store === STORES.SUMMARY || store === STORES.ACTIVE_SESSION ? { keyPath: 'id' } : { keyPath: 'id' });
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Generic CRUD helpers
async function dbGet<T>(storeName: string, id: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbPut<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function dbDelete(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// --- Domain Logic ---

const KG_TO_LB = 2.20462;

export function kgToDisplay(kg: number, system: 'Metric' | 'Imperial'): number {
  if (system === 'Metric') return Math.round(kg * 100) / 100;
  return Math.round(kg * KG_TO_LB * 10) / 10;
}

export function displayToKg(value: number, system: 'Metric' | 'Imperial'): number {
  if (system === 'Metric') return Math.round(value * 100) / 100;
  return value / KG_TO_LB;
}

export function normalizeExerciseName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').replace(/_{2,}/g, '_');
}

export const getExercises = async (): Promise<Exercise[]> => {
  const stored = await dbGetAll<Exercise>(STORES.EXERCISES);
  if (stored.length === 0) {
    const initial = (exercisesData.exercises as any[]).map(ex => {
      const muscleGroup = mapBodyPart(ex.body_part);
      const equipment = determineEquipment(ex.canonical_name);
      const imageData = getExerciseImage(ex.canonical_name, ex.id, muscleGroup, equipment);
      const loggingType = determineLoggingType(ex.canonical_name);
      return {
        id: ex.id,
        name: ex.canonical_name,
        muscleGroup,
        equipment,
        defaultSets: 3,
        defaultReps: loggingType === 'duration' ? 0 : 12,
        defaultDurationSeconds: loggingType === 'duration' ? 60 : undefined,
        loggingType,
        imageUrl: imageData.url,
        imageNeedsReview: imageData.needsReview,
        ...getCoachingData(ex.canonical_name, equipment, muscleGroup)
      } as Exercise;
    });
    for (const ex of initial) await dbPut(STORES.EXERCISES, ex);
    return initial;
  }
  return stored;
};

export const addExercise = async (exercise: Omit<Exercise, 'id' | 'imageUrl'>): Promise<Exercise> => {
  const id = Date.now().toString();
  const imageData = getExerciseImage(exercise.name, id, exercise.muscleGroup, exercise.equipment);
  const coaching = getCoachingData(exercise.name, exercise.equipment, exercise.muscleGroup);
  const newEx: Exercise = {
    ...exercise,
    id,
    imageUrl: imageData.url,
    imageNeedsReview: imageData.needsReview,
    ...coaching,
    ...exercise // Allow overrides from UI
  };
  await dbPut(STORES.EXERCISES, newEx);
  return newEx;
};

export const updateExercise = async (updatedEx: Exercise) => {
  await dbPut(STORES.EXERCISES, updatedEx);
};

export const getRoutines = async (): Promise<Routine[]> => {
  const stored = await dbGetAll<Routine>(STORES.ROUTINES);
  if (stored.length === 0) {
    const exercises = await getExercises();
    const initial: Routine[] = [
      { id: 'r1', name: 'Full Body Strength', exercises: [exercises[0], exercises[5] || exercises[0]], color: '#8b5cf6' },
    ];
    for (const r of initial) await dbPut(STORES.ROUTINES, r);
    return initial;
  }
  return stored;
};

export const saveRoutine = async (routine: Routine) => {
  await dbPut(STORES.ROUTINES, routine);
};

export const deleteRoutine = async (id: string) => {
  await dbDelete(STORES.ROUTINES, id);
};

export const getExerciseStats = async (exerciseId: string): Promise<ExerciseStats> => {
  const stats = await dbGet<{ id: string; stats: ExerciseStats }>(STORES.STATS, exerciseId);
  return stats?.stats || { sets: {} };
};

export const getExerciseHistory = async (exerciseId: string): Promise<HistoryPoint[]> => {
  const history = await dbGet<{ id: string; points: HistoryPoint[] }>(STORES.HISTORY, exerciseId);
  return history?.points || [];
};

export const saveAllWorkoutStats = async (exercises: RoutineExercise[]): Promise<WorkoutSummaryData> => {
  const date = new Date().toLocaleDateString('en-CA');
  const settings = getSettings();
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';
  
  const summary: WorkoutSummaryData = {
    routineName: '',
    routineColor: '',
    date,
    durationSeconds: 0,
    totalVolume: 0,
    totalSets: 0,
    exerciseCount: 0,
    muscleSplit: [],
    exercises: [],
    globalRecords: []
  };

  const muscleCounts: Record<string, number> = {};

  for (const ex of exercises) {
    const exHistory = await getExerciseHistory(ex.id);
    let maxWeight = 0;
    let maxReps = 0;
    let maxDuration = 0;
    let totalVolume = 0;
    let bestE1RM = 0;
    let validSets = 0;
    const exerciseRecords: string[] = [];

    const prevBestWeight = Math.max(...exHistory.map(h => h.weight), 0);
    const prevBestVolume = Math.max(...exHistory.map(h => h.volume), 0);
    const prevBestE1RM = Math.max(...exHistory.map(h => h.e1RM), 0);

    const currentStats = await getExerciseStats(ex.id);

    ex.sets.forEach((set, idx) => {
      if (set.completed || set.weight > 0 || set.reps > 0 || (set.durationSeconds && set.durationSeconds > 0)) {
        currentStats.sets[idx.toString()] = { weight: set.weight, reps: set.reps, durationSeconds: set.durationSeconds };
        maxWeight = Math.max(maxWeight, set.weight);
        maxReps = Math.max(maxReps, set.reps);
        maxDuration = Math.max(maxDuration, set.durationSeconds || 0);
        totalVolume += (set.weight * set.reps);
        validSets++;
        if (set.reps >= 1 && set.reps <= 10 && set.weight > 0) {
          bestE1RM = Math.max(bestE1RM, set.weight * (1 + set.reps / 30));
        }
      }
    });

    if (validSets > 0) {
      summary.totalSets += validSets;
      summary.totalVolume += totalVolume;
      summary.exerciseCount++;
      muscleCounts[ex.muscleGroup] = (muscleCounts[ex.muscleGroup] || 0) + validSets;

      if (maxWeight > prevBestWeight && maxWeight > 0) {
        exerciseRecords.push(`New Max Weight: ${kgToDisplay(maxWeight, settings.unitSystem)}${unitLabel} (+${kgToDisplay(maxWeight - prevBestWeight, settings.unitSystem)}${unitLabel})`);
      }
      if (totalVolume > prevBestVolume && totalVolume > 0) {
        exerciseRecords.push(`New Volume PR: ${Math.round(kgToDisplay(totalVolume, settings.unitSystem))}${unitLabel}`);
      }

      summary.exercises.push({
        id: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: validSets,
        topWeight: maxWeight,
        topReps: maxReps,
        volume: totalVolume,
        durationSeconds: maxDuration,
        loggingType: ex.loggingType,
        records: exerciseRecords
      });

      const updatedHistory = [...exHistory];
      const historyPoint = { date, weight: maxWeight, reps: maxReps, durationSeconds: maxDuration, sets: validSets, volume: totalVolume, e1RM: bestE1RM };
      const existingIdx = updatedHistory.findIndex(p => p.date === date);
      if (existingIdx > -1) updatedHistory[existingIdx] = historyPoint;
      else updatedHistory.push(historyPoint);
      
      await dbPut(STORES.STATS, { id: ex.id, stats: currentStats });
      await dbPut(STORES.HISTORY, { id: ex.id, points: updatedHistory });
    }
  }

  const allLogs = await dbGetAll<WorkoutLog>(STORES.LOGS);
  const prevMaxVol = Math.max(...allLogs.map(l => l.totalVolume || 0), 0);
  if (summary.totalVolume > prevMaxVol && allLogs.length > 0) {
    summary.globalRecords.push(`New Total Volume PR: ${Math.round(kgToDisplay(summary.totalVolume, settings.unitSystem))}${unitLabel}`);
  }

  const totalSets = Object.values(muscleCounts).reduce((a, b) => a + b, 0);
  summary.muscleSplit = Object.entries(muscleCounts).map(([muscle, count]) => ({
    muscle: muscle as MuscleGroup,
    count,
    percentage: Math.round((count / totalSets) * 100)
  })).sort((a, b) => b.count - a.count);
  
  await dbPut(STORES.SUMMARY, { id: 'latest', ...summary });
  return summary;
};

export const logWorkout = async (routine: Routine, durationSeconds: number, totalVolume: number) => {
  const newLog: WorkoutLog = {
    id: Date.now().toString(),
    routineId: routine.id,
    routineName: routine.name,
    routineColor: routine.color || '#8b5cf6',
    date: new Date().toLocaleDateString('en-CA'),
    durationSeconds,
    totalVolume
  };
  await dbPut(STORES.LOGS, newLog);
  const routines = await getRoutines();
  const rIdx = routines.findIndex(r => r.id === routine.id);
  if (rIdx > -1) {
    routines[rIdx].lastPerformed = newLog.date;
    await saveRoutine(routines[rIdx]);
  }
  const summary = await dbGet<WorkoutSummaryData>(STORES.SUMMARY, 'latest');
  if (summary) {
    summary.durationSeconds = durationSeconds;
    summary.routineName = routine.name;
    summary.routineColor = routine.color || '#8b5cf6';
    await dbPut(STORES.SUMMARY, summary);
  }
  await dbDelete(STORES.ACTIVE_SESSION, 'current');
};

export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  return dbGetAll<WorkoutLog>(STORES.LOGS);
};

export const getLastWorkoutSummary = async (): Promise<WorkoutSummaryData | null> => {
  return dbGet<WorkoutSummaryData>(STORES.SUMMARY, 'latest');
};

export const startActiveWorkoutSession = async (routineId: string) => {
  await dbPut(STORES.ACTIVE_SESSION, { id: 'current', routineId, startTime: Date.now() });
};

export const getActiveWorkoutSession = async (): Promise<{ routineId: string; startTime: number } | null> => {
  return dbGet<{ routineId: string; startTime: number }>(STORES.ACTIVE_SESSION, 'current');
};

export const clearActiveWorkoutSession = async () => {
  await dbDelete(STORES.ACTIVE_SESSION, 'current');
};

// Suggestions & Analysis (Proxies to history)

export const detectPlateau = async (exerciseId: string): Promise<PlateauAnalysis> => {
  const history = await getExerciseHistory(exerciseId);
  if (history.length < 4) return { status: 'Progressing', reason: 'Collecting initial data...', suggestions: [] };
  const recent = history.slice(-3);
  const prev = history[history.length - 4];
  const isProgressing = Math.max(...recent.map(h => h.weight)) > prev.weight * 1.01 || Math.max(...recent.map(h => h.volume)) > prev.volume * 1.01;
  if (isProgressing) return { status: 'Progressing', reason: 'Consistently hitting new records.', suggestions: [] };
  const tips = ["Increase rep target", "Add extra set", "Swap variation", "Slow eccentrics", "Strategic reset"];
  return { status: 'Plateau', reason: `Flat for ${recent.length} sessions.`, suggestions: tips.sort(() => 0.5 - Math.random()).slice(0, 2) };
};

export const getProgressionSuggestion = async (exerciseId: string): Promise<ProgressionSuggestion | null> => {
  const history = await getExerciseHistory(exerciseId);
  if (history.length === 0) return null;
  const last = history[history.length - 1];
  const settings = getSettings();
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';
  const exercises = await getExercises();
  const ex = exercises.find(e => e.id === exerciseId);
  if (!ex) return null;
  const lastText = ex.loggingType === 'duration' ? `${last.durationSeconds}s` : `${last.weight > 0 ? kgToDisplay(last.weight, settings.unitSystem) + unitLabel + ' x ' : ''}${last.reps} reps`;

  if (ex.loggingType === 'duration') return { type: 'increase_duration', suggestedDuration: (last.durationSeconds || 0) + 10, reason: "Improve endurance.", lastStatsText: lastText };
  const plateau = await detectPlateau(exerciseId);
  if (plateau.status === 'Plateau') return { type: 'deload', suggestedWeight: last.weight * 0.9, suggestedReps: last.reps + 2, reason: "Break plateau.", lastStatsText: lastText };
  if (last.reps >= 12) return { type: 'increase_weight', suggestedWeight: last.weight + displayToKg(settings.unitSystem === 'Metric' ? 0.25 : 5, settings.unitSystem), suggestedReps: 8, reason: "Strength build.", lastStatsText: lastText };
  return { type: 'increase_reps', suggestedWeight: last.weight, suggestedReps: last.reps + 2, reason: "Volume overload.", lastStatsText: lastText };
};

// Utils

const mapBodyPart = (part: string | null): MuscleGroup => {
  if (!part) return 'Cardio';
  const p = part.toLowerCase();
  if (p.includes('chest')) return 'Chest';
  if (p.includes('back')) return 'Back';
  if (p.includes('legs') || p.includes('calves')) return 'Legs';
  if (p.includes('shoulders')) return 'Shoulders';
  if (p.includes('biceps') || p.includes('triceps')) return 'Arms';
  if (p.includes('abdominals') || p.includes('abs')) return 'Abs';
  return 'Cardio';
};

const determineEquipment = (name: string): Equipment => {
  const n = name.toLowerCase();
  if (n.includes('dumbbell') || n.includes('db')) return 'Dumbbell';
  if (n.includes('barbell') || n.includes('bb')) return 'Barbell';
  if (n.includes('cable')) return 'Cable';
  if (n.includes('machine') || n.includes('pressdown') || n.includes('extension')) return 'Machine';
  return 'Bodyweight';
};

const determineLoggingType = (name: string): LoggingType => {
  const n = name.toLowerCase();
  if (n.includes('plank') || n.includes('hold') || n.includes('hang')) return 'duration';
  return 'weight_reps';
};

export function getExerciseImage(name: string, id: string, muscleGroup: MuscleGroup, equipment: Equipment): { url: string; needsReview: boolean } {
  const exerciseImageMap: Record<string, string> = { barbell_bench_press: 'bench_press', barbell_deadlift: 'deadlift', barbell_squat: 'barbell_squat', plank: 'plank_core', running_treadmill: 'treadmill_running' };
  const mapped = exerciseImageMap[normalizeExerciseName(id)];
  if (mapped) return { url: `https://picsum.photos/seed/${mapped}/600/400`, needsReview: false };
  return { url: `https://picsum.photos/seed/${normalizeExerciseName(muscleGroup + equipment)}/600/400`, needsReview: true };
}

export const getCoachingData = (name: string, equipment: Equipment, muscle: MuscleGroup) => {
  if (muscle === 'Chest') return { cues: ["Retract blades", "Squeeze at top"], mistakes: ["Elbow flare"], secondaryMuscles: ["Triceps"] };
  if (muscle === 'Back') return { cues: ["Pull with elbows", "Neutral spine"], mistakes: ["Body swing"], secondaryMuscles: ["Biceps"] };
  if (muscle === 'Legs') return { cues: ["Heel drive", "Knees out"], mistakes: ["Knee cave"], secondaryMuscles: ["Glutes"] };
  return { cues: ["Control movement"], mistakes: ["Using momentum"] };
};

export const ROUTINE_COLORS = [
  { name: 'Strength Violet', value: '#8b5cf6' },
  { name: 'Energetic Blue', value: '#3b82f6' },
  { name: 'Fit Green', value: '#10b981' },
  { name: 'Active Red', value: '#f43f5e' },
  { name: 'Focus Amber', value: '#f59e0b' },
];
