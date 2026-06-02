
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
  sets: { [setIndex: number]: SetStats };
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

export const DEFAULT_EXERCISES: Exercise[] = exercisesData.exercises as Exercise[];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v12');
  if (!stored) {
    localStorage.setItem('user_exercises_v12', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v12', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: {} };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_v9') || '{}');
  return allStats[exerciseId] || { sets: {} };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_v9') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: {} };
  }
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_v9', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines_v10');
  if (!stored) {
    const exercises = getExercises();
    const initial: Routine[] = [
      { id: 'r1', name: 'Full Body Strength', exercises: [exercises[0], exercises[12], exercises[23], exercises[55]], color: '#8b5cf6' },
      { id: 'r2', name: 'Upper Body Focus', exercises: [exercises[0], exercises[17], exercises[34], exercises[42]], color: '#3b82f6' },
    ];
    localStorage.setItem('user_routines_v10', JSON.stringify(initial));
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
  localStorage.setItem('user_routines_v10', JSON.stringify(routines));
};

export const deleteRoutine = (id: string) => {
  const routines = getRoutines().filter(r => r.id !== id);
  localStorage.setItem('user_routines_v10', JSON.stringify(routines));
};

export const logWorkout = (routine: Routine) => {
  if (typeof window === 'undefined') return;
  const logs: WorkoutLog[] = JSON.parse(localStorage.getItem('workout_logs_v4') || '[]');
  const newLog: WorkoutLog = {
    id: Date.now().toString(),
    routineId: routine.id,
    routineName: routine.name,
    routineColor: routine.color || '#8b5cf6',
    date: new Date().toLocaleDateString('en-CA'),
  };
  logs.push(newLog);
  localStorage.setItem('workout_logs_v4', JSON.stringify(logs));
  
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === routine.id);
  if (index > -1) {
    routines[index].lastPerformed = newLog.date;
    localStorage.setItem('user_routines_v10', JSON.stringify(routines));
  }
};

export const getWorkoutLogs = (): WorkoutLog[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('workout_logs_v4') || '[]');
};
