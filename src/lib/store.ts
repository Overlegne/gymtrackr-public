
export type MuscleGroup = 'Borst' | 'Rug' | 'Benen' | 'Schouders' | 'Armen' | 'Buik' | 'Cardio';
export type Equipment = 'Halter' | 'Barbell' | 'Machine' | 'Kabel' | 'Bodyweight';

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
  sets: SetStats[];
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
  lastPerformed?: Date;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench/600/400' },
  { id: '2', name: 'Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/squat/600/400' },
  { id: '3', name: 'Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift/600/400' },
  { id: '4', name: 'Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat/600/400' },
  { id: '5', name: 'Shoulder Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/shoulder/600/400' },
  { id: '6', name: 'Bicep Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bicep/600/400' },
  { id: '7', name: 'Tricep Extension', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tricep/600/400' },
  { id: '8', name: 'Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legpress/600/400' },
  { id: '9', name: 'Chest Fly', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/chestfly/600/400' },
  { id: '10', name: 'Seated Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/row/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises');
  if (!stored) {
    localStorage.setItem('user_exercises', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: [] };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set') || '{}');
  return allStats[exerciseId] || { sets: [] };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: [] };
  }
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_per_set', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines');
  if (!stored) {
    const exercises = getExercises();
    const initial = [
      { id: 'r1', name: 'Full Body A', exercises: [exercises[0], exercises[1], exercises[3]] },
      { id: 'r2', name: 'Push Day', exercises: [exercises[0], exercises[4], exercises[6], exercises[8]] },
    ];
    localStorage.setItem('user_routines', JSON.stringify(initial));
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
  localStorage.setItem('user_routines', JSON.stringify(routines));
};
