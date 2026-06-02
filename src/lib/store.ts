
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
  // BORST (CHEST)
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench/600/400' },
  { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/incline/600/400' },
  { id: '9', name: 'Dumbbell Chest Fly', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/chestfly/600/400' },
  { id: '17', name: 'Decline Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/decline/600/400' },
  { id: 'sf1', name: 'Push-Ups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  
  // BENEN (LEGS)
  { id: '3', name: 'Barbell Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat/600/400' },
  { id: '8', name: 'Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legpress/600/400' },
  { id: '18', name: 'Leg Extension', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legext/600/400' },
  { id: 'sf2', name: 'Leg Curl', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legcurl/600/400' },
  { id: 'sf3', name: 'Calf Raise', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/calf/600/400' },
  
  // RUG (BACK)
  { id: '4', name: 'Conventional Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift/600/400' },
  { id: '19', name: 'Romanian Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/rdl/600/400' },
  { id: '5', name: 'Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat/600/400' },
  { id: '10', name: 'Seated Cable Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/row/600/400' },
  { id: 'sf4', name: 'Bent Over Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/backrow/600/400' },
  
  // SCHOUDERS (SHOULDERS)
  { id: '6', name: 'Overhead Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/shoulder/600/400' },
  { id: '13', name: 'Lateral Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },
  { id: 'sf5', name: 'Front Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/frontraise/600/400' },
  
  // ARMEN (ARMS)
  { id: '7', name: 'Bicep Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bicep/600/400' },
  { id: '20', name: 'Hammer Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hammer/600/400' },
  { id: '14', name: 'Tricep Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tricep/600/400' },
  { id: '21', name: 'Skull Crusher', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },
  
  // BUIK (ABS)
  { id: '15', name: 'Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '16', name: 'Leg Raise', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legraise/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v3');
  if (!stored) {
    localStorage.setItem('user_exercises_v3', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v3', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: [] };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v2') || '{}');
  return allStats[exerciseId] || { sets: [] };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v2') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: [] };
  }
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_per_set_v2', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines_v2');
  if (!stored) {
    const exercises = getExercises();
    const initial = [
      { id: 'r1', name: 'Full Body A', exercises: [exercises[0], exercises[5], exercises[10]] },
      { id: 'r2', name: 'Upper Body', exercises: [exercises[0], exercises[14], exercises[15], exercises[18]] },
    ];
    localStorage.setItem('user_routines_v2', JSON.stringify(initial));
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
  localStorage.setItem('user_routines_v2', JSON.stringify(routines));
};
