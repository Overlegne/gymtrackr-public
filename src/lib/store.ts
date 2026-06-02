
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

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench/600/400' },
  { id: '2', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/incbench/600/400' },
  { id: '3', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbbench/600/400' },
  { id: '4', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/incdb/600/400' },
  { id: '5', name: 'Dumbbell Flys', muscleGroup: 'Chest', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/flys/600/400' },
  { id: '7', name: 'Push-Ups', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  { id: '40', name: 'Pec Deck Machine', muscleGroup: 'Chest', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pecdeck/600/400' },

  // BACK
  { id: '8', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift/600/400' },
  { id: '9', name: 'Pull-Ups', muscleGroup: 'Back', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/pullup/600/400' },
  { id: '10', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat/600/400' },
  { id: '11', name: 'Bent Over Row', muscleGroup: 'Back', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/row/600/400' },
  { id: '12', name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'Cable', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablerow/600/400' },

  // LEGS
  { id: '15', name: 'Barbell Squat', muscleGroup: 'Legs', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat/600/400' },
  { id: '16', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lpress/600/400' },
  { id: '17', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/rdl/600/400' },
  { id: '18', name: 'Leg Extensions', muscleGroup: 'Legs', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lext/600/400' },
  { id: '19', name: 'Lying Leg Curls', muscleGroup: 'Legs', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lcurl/600/400' },

  // SHOULDERS
  { id: '22', name: 'Military Press', muscleGroup: 'Shoulders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/opress/600/400' },
  { id: '23', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbpress/600/400' },
  { id: '24', name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },

  // ARMS
  { id: '27', name: 'Barbell Curl', muscleGroup: 'Arms', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bcurl/600/400' },
  { id: '28', name: 'Hammer Curl', muscleGroup: 'Arms', equipment: 'Dumbbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hcurl/600/400' },
  { id: '30', name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tpush/600/400' },
  { id: '31', name: 'Skull Crushers', muscleGroup: 'Arms', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },

  // ABS
  { id: '33', name: 'Plank', muscleGroup: 'Abs', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '34', name: 'Hanging Leg Raises', muscleGroup: 'Abs', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lraise/600/400' },

  // CARDIO
  { id: '36', name: 'Running (Treadmill)', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/run/600/400' },
  { id: '37', name: 'Rowing Machine', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 3, defaultReps: 500, imageUrl: 'https://picsum.photos/seed/rower/600/400' },
];

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
      { id: 'r1', name: 'Full Body Strength', exercises: [exercises[0], exercises[7], exercises[12], exercises[17]], color: '#8b5cf6' },
      { id: 'r2', name: 'Upper Body Focus', exercises: [exercises[0], exercises[10], exercises[18], exercises[21]], color: '#3b82f6' },
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
