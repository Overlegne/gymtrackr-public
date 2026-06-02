export type MuscleGroup = 'Borst' | 'Rug' | 'Benen' | 'Schouders' | 'Armen' | 'Buik' | 'Cardio';
export type Equipment = 'Halter' | 'Barbell' | 'Machine' | 'Kabel' | 'Bodyweight';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  defaultSets: number;
  defaultReps: number;
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
  { id: '1', name: 'Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10 },
  { id: '2', name: 'Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12 },
  { id: '3', name: 'Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5 },
  { id: '4', name: 'Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12 },
  { id: '5', name: 'Shoulder Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 10 },
  { id: '6', name: 'Bicep Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12 },
  { id: '7', name: 'Tricep Extension', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12 },
  { id: '8', name: 'Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15 },
  { id: '9', name: 'Chest Fly', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12 },
  { id: '10', name: 'Seated Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12 },
];

// In a real app, these would be in a DB. Using local storage for "persistency" in this demo.
export const getExerciseWeight = (exerciseId: string): number => {
  if (typeof window === 'undefined') return 0;
  const weights = JSON.parse(localStorage.getItem('exercise_weights') || '{}');
  return weights[exerciseId] || 0;
};

export const saveExerciseWeight = (exerciseId: string, weight: number) => {
  if (typeof window === 'undefined') return;
  const weights = JSON.parse(localStorage.getItem('exercise_weights') || '{}');
  weights[exerciseId] = weight;
  localStorage.setItem('exercise_weights', JSON.stringify(weights));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines');
  if (!stored) {
    // Initial data
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
