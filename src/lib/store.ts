
import exercisesData from './exercises.json';

export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio';
export type Equipment = 'Dumbbell' | 'Barbell' | 'Machine' | 'Cable' | 'Bodyweight';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  defaultSets: number;
  defaultReps: number;
  imageUrl: string;
  imageNeedsReview?: boolean;
}

export interface SetStats {
  weight: number;
  reps: number;
}

export interface ExerciseStats {
  sets: { [setIndex: string]: SetStats };
}

export interface RoutineExercise extends Exercise {
  sets: {
    reps: number;
    weight: number;
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
}

export const ROUTINE_COLORS = [
  { name: 'Strength Violet', value: '#8b5cf6' },
  { name: 'Energetic Blue', value: '#3b82f6' },
  { name: 'Fit Green', value: '#10b981' },
  { name: 'Active Red', value: '#f43f5e' },
  { name: 'Focus Amber', value: '#f59e0b' },
  { name: 'Indigo Power', value: '#6366f1' },
  { name: 'Cyan Clarity', value: '#06b6d4' },
  { name: 'Orange Energy', value: '#f97316' },
  { name: 'Gray Grit', value: '#64748b' },
];

/**
 * Normalizes an exercise name for consistent mapping.
 */
export function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_{2,}/g, '_');
}

/**
 * Deterministic mapping of exercises to stable image seeds/hints.
 */
const exerciseImageMap: Record<string, string> = {
  // Chest
  barbell_bench_press: 'bench_press',
  dumbbell_bench_press: 'dumbbell_press',
  incline_barbell_bench_press: 'incline_bench',
  pec_deck: 'pec_deck_machine',
  chest_dips: 'chest_dips',
  push_ups: 'push_ups',
  
  // Back
  barbell_deadlift: 'deadlift',
  barbell_row: 'bent_over_row',
  pull_up: 'pull_up',
  wide_grip_pulldown: 'lat_pulldown',
  seated_cable_row: 'cable_row',
  hyperextensions: 'back_extension',

  // Legs
  barbell_squat: 'barbell_squat',
  leg_press: 'leg_press_machine',
  leg_extension: 'leg_extension_machine',
  lying_leg_curl: 'leg_curl_machine',
  romanian_deadlift: 'romanian_deadlift',
  calf_raise_standing: 'calf_raise',

  // Shoulders
  dumbbell_shoulder_press: 'shoulder_press',
  dumbbell_lateral_raise: 'lateral_raise',
  face_pull: 'face_pull_cable',
  arnold_press: 'arnold_press',

  // Arms
  barbell_curl: 'bicep_curl',
  triceps_pressdown: 'tricep_pushdown',
  skull_crushers: 'skull_crusher_tricep',
  hammer_curl: 'hammer_curl',

  // Abs
  plank: 'plank_core',
  crunch: 'abs_crunch',
  hanging_leg_raise: 'hanging_leg_raise',

  // Cardio
  running_treadmill: 'treadmill_running',
  burpees: 'burpees_exercise',
};

/**
 * Category-based fallback images for items without exact matches.
 */
const categoryFallbackMap: Record<string, string> = {
  'Chest_Barbell': 'barbell_chest_generic',
  'Chest_Dumbbell': 'dumbbell_chest_generic',
  'Chest_Machine': 'machine_chest_generic',
  'Back_Barbell': 'barbell_back_generic',
  'Back_Cable': 'cable_back_generic',
  'Legs_Barbell': 'barbell_legs_generic',
  'Legs_Machine': 'machine_legs_generic',
  'Arms_Dumbbell': 'dumbbell_arms_generic',
  'Shoulders_Dumbbell': 'dumbbell_shoulders_generic',
  'Abs_Bodyweight': 'bodyweight_abs_generic',
  'Cardio_Bodyweight': 'cardio_generic',
};

/**
 * Gets the most appropriate image URL for an exercise.
 */
export function getExerciseImage(
  name: string,
  id: string,
  muscleGroup: MuscleGroup,
  equipment: Equipment
): { url: string; needsReview: boolean } {
  const normalizedId = normalizeExerciseName(id);
  const normalizedName = normalizeExerciseName(name);

  // 1. Exact ID/Slug match
  if (exerciseImageMap[normalizedId]) {
    return {
      url: `https://picsum.photos/seed/${exerciseImageMap[normalizedId]}/600/400`,
      needsReview: false,
    };
  }

  // 2. Exact name match
  if (exerciseImageMap[normalizedName]) {
    return {
      url: `https://picsum.photos/seed/${exerciseImageMap[normalizedName]}/600/400`,
      needsReview: false,
    };
  }

  // 3. Category Fallback
  const fallbackKey = `${muscleGroup}_${equipment}`;
  const fallbackSeed = categoryFallbackMap[fallbackKey] || normalizeExerciseName(`${muscleGroup}_${equipment}`);
  
  return {
    url: `https://picsum.photos/seed/${fallbackSeed}/600/400`,
    needsReview: true,
  };
}

const mapBodyPart = (part: string | null): MuscleGroup => {
  if (!part) return 'Cardio';
  const p = part.toLowerCase();
  if (p.includes('chest')) return 'Chest';
  if (p.includes('back')) return 'Back';
  if (p.includes('legs') || p.includes('calves')) return 'Legs';
  if (p.includes('shoulders')) return 'Shoulders';
  if (p.includes('biceps') || p.includes('triceps') || p.includes('arms')) return 'Arms';
  if (p.includes('abdominals') || p.includes('abs')) return 'Abs';
  return 'Cardio';
};

const determineEquipment = (name: string): Equipment => {
  const n = name.toLowerCase();
  if (n.includes('dumbbell') || n.includes('db')) return 'Dumbbell';
  if (n.includes('barbell') || n.includes('bb')) return 'Barbell';
  if (n.includes('cable')) return 'Cable';
  if (n.includes('machine') || n.includes('pressdown') || n.includes('extension') || n.includes('pec deck')) return 'Machine';
  return 'Bodyweight';
};

export const DEFAULT_EXERCISES: Exercise[] = (exercisesData.exercises as any[]).map(ex => {
  const muscleGroup = mapBodyPart(ex.body_part);
  const equipment = determineEquipment(ex.canonical_name);
  const imageData = getExerciseImage(ex.canonical_name, ex.id, muscleGroup, equipment);

  return {
    id: ex.id,
    name: ex.canonical_name,
    muscleGroup,
    equipment,
    defaultSets: 3,
    defaultReps: 12,
    imageUrl: imageData.url,
    imageNeedsReview: imageData.needsReview
  };
});

const EXERCISES_KEY = 'user_exercises_v15';
const STATS_KEY = 'exercise_stats_v11';
const ROUTINES_KEY = 'user_routines_v11';
const LOGS_KEY = 'workout_logs_v5';

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem(EXERCISES_KEY);
  if (!stored) {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(DEFAULT_EXERCISES));
    return DEFAULT_EXERCISES;
  }
  return JSON.parse(stored);
};

export const addExercise = (exercise: Omit<Exercise, 'id' | 'imageUrl'>) => {
  const exercises = getExercises();
  const imageData = getExerciseImage(exercise.name, '', exercise.muscleGroup, exercise.equipment);
  const newExercise: Exercise = {
    ...exercise,
    id: Date.now().toString(),
    imageUrl: imageData.url,
    imageNeedsReview: imageData.needsReview
  };
  exercises.push(newExercise);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  return newExercise;
};

export const updateExercise = (updatedEx: Exercise) => {
  const exercises = getExercises();
  const index = exercises.findIndex(e => e.id === updatedEx.id);
  if (index > -1) {
    exercises[index] = updatedEx;
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: {} };
  const allStats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  return allStats[exerciseId] || { sets: {} };
};

export const saveAllWorkoutStats = (exercises: RoutineExercise[]) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  
  exercises.forEach(ex => {
    if (!allStats[ex.id]) {
      allStats[ex.id] = { sets: {} };
    }
    ex.sets.forEach((set, idx) => {
      if (set.completed || set.weight > 0 || set.reps > 0) {
        allStats[ex.id].sets[idx.toString()] = { weight: set.weight, reps: set.reps };
      }
    });
  });
  
  localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ROUTINES_KEY);
  if (!stored) {
    const exercises = getExercises();
    const initial: Routine[] = [
      { id: 'r1', name: 'Full Body Strength', exercises: [exercises[0], exercises[5] || exercises[0]], color: '#8b5cf6' },
    ];
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const saveRoutine = (routine: Routine) => {
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === routine.id);
  if (index > -1) {
    routines[index] = routine;
  } else {
    routines.push(routine);
  }
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
};

export const deleteRoutine = (id: string) => {
  const routines = getRoutines().filter(r => r.id !== id);
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
};

export const logWorkout = (routine: Routine) => {
  if (typeof window === 'undefined') return;
  const logs: WorkoutLog[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  const newLog: WorkoutLog = {
    id: Date.now().toString(),
    routineId: routine.id,
    routineName: routine.name,
    routineColor: routine.color || '#8b5cf6',
    date: new Date().toLocaleDateString('en-CA'),
  };
  logs.push(newLog);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === routine.id);
  if (index > -1) {
    routines[index].lastPerformed = newLog.date;
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  }
};

export const getWorkoutLogs = (): WorkoutLog[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
};
