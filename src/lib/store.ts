
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
  // Extended Metadata
  secondaryMuscles?: string[];
  description?: string;
  cues?: string[];
  alternatives?: { name: string; id: string }[];
  mistakes?: string[];
}

export interface SetStats {
  weight: number;
  reps: number;
}

export interface ExerciseStats {
  sets: { [setIndex: string]: SetStats };
}

export interface HistoryPoint {
  date: string;
  weight: number;
  reps: number;
  sets: number;
  volume: number;
  e1RM: number;
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
 * Coaching Cues and Metadata Database
 * Generates context-aware coaching information.
 */
export const getCoachingData = (name: string, equipment: Equipment, muscle: MuscleGroup) => {
  const n = name.toLowerCase();
  const data: Partial<Exercise> = {
    cues: ["Control the movement", "Full range of motion", "Brace your core"],
    alternatives: [],
    mistakes: ["Using momentum", "Short range of motion"],
    secondaryMuscles: []
  };

  // Chest Patterns
  if (muscle === 'Chest') {
    data.cues = ["Retract shoulder blades", "Squeeze chest at top", "Control descent", "Stack wrists over elbows"];
    data.secondaryMuscles = ["Triceps", "Front Delts"];
    data.mistakes = ["Flaring elbows too wide", "Bouncing bar off chest"];
    if (n.includes('dumbbell')) {
      data.alternatives = [{ name: "Barbell Bench Press", id: "barbell_bench_press" }];
    } else {
      data.alternatives = [{ name: "Dumbbell Bench Press", id: "dumbbell_bench_press" }];
    }
  } 
  // Back Patterns
  else if (muscle === 'Back') {
    data.cues = ["Pull with elbows", "Squeeze shoulder blades", "Avoid torso rock", "Chest up throughout"];
    data.secondaryMuscles = ["Biceps", "Rear Delts", "Forearms"];
    data.mistakes = ["Using too much body English", "Rounded lower back"];
    if (n.includes('row')) {
      data.alternatives = [{ name: "Lat Pulldown", id: "wide_grip_pulldown" }];
    } else {
      data.alternatives = [{ name: "Seated Cable Row", id: "seated_cable_row" }];
    }
  }
  // Leg Patterns
  else if (muscle === 'Legs') {
    data.cues = ["Drive through heels", "Keep chest proud", "Knees out", "Brace core heavily"];
    data.secondaryMuscles = ["Glutes", "Lower Back", "Adductors"];
    data.mistakes = ["Knees caving in", "Heels lifting off floor"];
    if (n.includes('squat')) {
      data.alternatives = [{ name: "Leg Press", id: "leg_press" }];
    } else if (n.includes('deadlift')) {
      data.alternatives = [{ name: "Romanian Deadlift", id: "romanian_deadlift" }];
    }
  }
  // Arm Patterns
  else if (muscle === 'Arms') {
    data.cues = ["Isolate the muscle", "No momentum", "Full extension", "Keep elbows stationary"];
    data.secondaryMuscles = ["Forearms"];
    data.mistakes = ["Swinging the weight", "Partial range of motion"];
    if (n.includes('bicep')) {
      data.alternatives = [{ name: "Hammer Curl", id: "hammer_curl" }];
    } else {
      data.alternatives = [{ name: "Skull Crushers", id: "skull_crushers" }];
    }
  }
  // Shoulder Patterns
  else if (muscle === 'Shoulders') {
    data.cues = ["Neutral wrists", "Drive vertically", "Core braced", "Controlled negative"];
    data.secondaryMuscles = ["Triceps", "Upper Traps"];
    data.mistakes = ["Arching lower back", "Partial reps"];
    data.alternatives = [{ name: "Arnold Press", id: "arnold_press" }];
  }

  return data;
};

const exerciseImageMap: Record<string, string> = {
  barbell_bench_press: 'bench_press',
  dumbbell_bench_press: 'dumbbell_press',
  incline_barbell_bench_press: 'incline_bench',
  pec_deck: 'pec_deck_machine',
  chest_dips: 'chest_dips',
  push_ups: 'push_ups',
  barbell_deadlift: 'deadlift',
  barbell_row: 'bent_over_row',
  pull_up: 'pull_up',
  wide_grip_pulldown: 'lat_pulldown',
  seated_cable_row: 'cable_row',
  hyperextensions: 'back_extension',
  barbell_squat: 'barbell_squat',
  leg_press: 'leg_press_machine',
  leg_extension: 'leg_extension_machine',
  lying_leg_curl: 'leg_curl_machine',
  romanian_deadlift: 'romanian_deadlift',
  calf_raise_standing: 'calf_raise',
  dumbbell_shoulder_press: 'shoulder_press',
  dumbbell_lateral_raise: 'lateral_raise',
  face_pull: 'face_pull_cable',
  arnold_press: 'arnold_press',
  barbell_curl: 'bicep_curl',
  triceps_pressdown: 'tricep_pushdown',
  skull_crushers: 'skull_crusher_tricep',
  hammer_curl: 'hammer_curl',
  plank: 'plank_core',
  crunch: 'abs_crunch',
  hanging_leg_raise: 'hanging_leg_raise',
  running_treadmill: 'treadmill_running',
  burpees: 'burpees_exercise',
};

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

export function getExerciseImage(
  name: string,
  id: string,
  muscleGroup: MuscleGroup,
  equipment: Equipment
): { url: string; needsReview: boolean } {
  const normalizedId = normalizeExerciseName(id);
  const normalizedName = normalizeExerciseName(name);

  if (exerciseImageMap[normalizedId]) {
    return {
      url: `https://picsum.photos/seed/${exerciseImageMap[normalizedId]}/600/400`,
      needsReview: false,
    };
  }

  if (exerciseImageMap[normalizedName]) {
    return {
      url: `https://picsum.photos/seed/${exerciseImageNameMap[normalizedName]}/600/400`,
      needsReview: false,
    };
  }

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
  const coaching = getCoachingData(ex.canonical_name, equipment, muscleGroup);

  return {
    id: ex.id,
    name: ex.canonical_name,
    muscleGroup,
    equipment,
    defaultSets: 3,
    defaultReps: 12,
    imageUrl: imageData.url,
    imageNeedsReview: imageData.needsReview,
    ...coaching
  };
});

const EXERCISES_KEY = 'user_exercises_v15';
const STATS_KEY = 'exercise_stats_v11';
const ROUTINES_KEY = 'user_routines_v11';
const LOGS_KEY = 'workout_logs_v5';
const HISTORY_KEY = 'exercise_history_v1';

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
  
  // If user didn't provide cues, generate them
  const generatedCoaching = getCoachingData(exercise.name, exercise.equipment, exercise.muscleGroup);
  
  const newExercise: Exercise = {
    ...exercise,
    cues: exercise.cues && exercise.cues.length > 0 ? exercise.cues : generatedCoaching.cues,
    secondaryMuscles: exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? exercise.secondaryMuscles : generatedCoaching.secondaryMuscles,
    alternatives: exercise.alternatives && exercise.alternatives.length > 0 ? exercise.alternatives : generatedCoaching.alternatives,
    mistakes: exercise.mistakes && exercise.mistakes.length > 0 ? exercise.mistakes : generatedCoaching.mistakes,
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
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  const date = new Date().toLocaleDateString('en-CA');
  
  exercises.forEach(ex => {
    // Current Best Stats
    if (!allStats[ex.id]) {
      allStats[ex.id] = { sets: {} };
    }
    
    // Calculate best metrics for this workout session
    let maxWeight = 0;
    let maxReps = 0;
    let totalVolume = 0;
    let bestE1RM = 0;
    let validSets = 0;

    ex.sets.forEach((set, idx) => {
      if (set.completed || set.weight > 0 || set.reps > 0) {
        // Update current bests per set index
        allStats[ex.id].sets[idx.toString()] = { weight: set.weight, reps: set.reps };
        
        // Tracking for history
        maxWeight = Math.max(maxWeight, set.weight);
        maxReps = Math.max(maxReps, set.reps);
        totalVolume += (set.weight * set.reps);
        validSets++;

        // Epley 1RM Formula: w * (1 + r/30)
        if (set.reps >= 1 && set.reps <= 10 && set.weight > 0) {
          const e1rm = set.weight * (1 + set.reps / 30);
          bestE1RM = Math.max(bestE1RM, e1rm);
        }
      }
    });

    // Save historical data if any sets were performed
    if (validSets > 0) {
      if (!history[ex.id]) history[ex.id] = [];
      const historyPoint: HistoryPoint = {
        date,
        weight: maxWeight,
        reps: maxReps,
        sets: validSets,
        volume: totalVolume,
        e1RM: bestE1RM
      };
      // Only keep one entry per day per exercise (latest)
      const existingIdx = history[ex.id].findIndex((p: HistoryPoint) => p.date === date);
      if (existingIdx > -1) {
        history[ex.id][existingIdx] = historyPoint;
      } else {
        history[ex.id].push(historyPoint);
      }
    }
  });
  
  localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const getExerciseHistory = (exerciseId: string): HistoryPoint[] => {
  if (typeof window === 'undefined') return [];
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  return history[exerciseId] || [];
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
