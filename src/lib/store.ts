
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

export const DEFAULT_EXERCISES: Exercise[] = (exercisesData.exercises as any[]).map(ex => ({
  id: ex.id,
  name: ex.canonical_name,
  muscleGroup: mapBodyPart(ex.body_part),
  equipment: 'Barbell',
  defaultSets: 3,
  defaultReps: 12,
  imageUrl: `https://picsum.photos/seed/${ex.id}/600/400`
}));

const EXERCISES_KEY = 'user_exercises_v14';
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

export const addExercise = (exercise: Omit<Exercise, 'id'>) => {
  const exercises = getExercises();
  const newExercise = {
    ...exercise,
    id: Date.now().toString(),
  };
  exercises.push(newExercise);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  return newExercise;
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
      // Save if completed OR if there's actual data entered (weight > 0)
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
