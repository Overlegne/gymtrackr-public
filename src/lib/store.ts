
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

export interface ExerciseStats {
  weight: number;
  reps: number;
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

export const EXERCISES: Exercise[] = [
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

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { weight: 0, reps: 0 };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats') || '{}');
  return allStats[exerciseId] || { weight: 0, reps: 0 };
};

export const saveExerciseStats = (exerciseId: string, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats') || '{}');
  allStats[exerciseId] = { weight, reps };
  localStorage.setItem('exercise_stats', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines');
  if (!stored) {
    const initial = [
      { id: 'r1', name: 'Full Body A', exercises: [EXERCISES[0], EXERCISES[1], EXERCISES[3]] },
      { id: 'r2', name: 'Push Day', exercises: [EXERCISES[0], EXERCISES[4], EXERCISES[6], EXERCISES[8]] },
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
