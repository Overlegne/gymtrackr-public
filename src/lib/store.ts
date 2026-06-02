
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
  // BORST
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench1/600/400' },
  { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/incline/600/400' },
  { id: '3', name: 'Dumbbell Chest Fly', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/chestfly1/600/400' },
  { id: '4', name: 'Push-Ups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  
  // BENEN
  { id: '5', name: 'Barbell Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat1/600/400' },
  { id: '6', name: 'Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legpress1/600/400' },
  { id: '7', name: 'Leg Extension', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legext/600/400' },
  { id: '8', name: 'Lying Leg Curl', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legcurl/600/400' },
  
  // RUG
  { id: '9', name: 'Conventional Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift1/600/400' },
  { id: '10', name: 'Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat1/600/400' },
  { id: '11', name: 'Seated Cable Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/row1/600/400' },
  { id: '12', name: 'Pull-Ups', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/pullup/600/400' },
  
  // SCHOUDERS
  { id: '13', name: 'Overhead Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/shoulder1/600/400' },
  { id: '14', name: 'Lateral Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },
  { id: '15', name: 'Reverse Fly', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/revfly/600/400' },
  
  // ARMEN
  { id: '16', name: 'Bicep Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bicep1/600/400' },
  { id: '17', name: 'Hammer Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hammer/600/400' },
  { id: '18', name: 'Tricep Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tricep1/600/400' },
  { id: '19', name: 'Skull Crusher', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },
  
  // BUIK
  { id: '20', name: 'Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '21', name: 'Hanging Leg Raise', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legraise/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v4');
  if (!stored) {
    localStorage.setItem('user_exercises_v4', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v4', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: [] };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v3') || '{}');
  return allStats[exerciseId] || { sets: [] };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v3') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: [] };
  }
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_per_set_v3', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines_v3');
  if (!stored) {
    const exercises = getExercises();
    const initial = [
      { id: 'r1', name: 'Full Body Kracht', exercises: [exercises[0], exercises[4], exercises[8], exercises[12]] },
      { id: 'r2', name: 'Borst & Triceps', exercises: [exercises[0], exercises[1], exercises[17], exercises[18]] },
    ];
    localStorage.setItem('user_routines_v3', JSON.stringify(initial));
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
  localStorage.setItem('user_routines_v3', JSON.stringify(routines));
};
