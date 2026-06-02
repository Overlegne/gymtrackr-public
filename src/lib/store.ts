
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

export const DEFAULT_EXERCISES: Exercise[] = [
  // BORST
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench1/600/400' },
  { id: '2', name: 'Incline Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/incbench/600/400' },
  { id: '3', name: 'Dumbbell Bench Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbbench/600/400' },
  { id: '4', name: 'Dumbbell Flys', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/flys/600/400' },
  { id: '5', name: 'Push-Ups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  
  // RUG
  { id: '6', name: 'Conventional Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift1/600/400' },
  { id: '7', name: 'Bent Over Barbell Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/row1/600/400' },
  { id: '8', name: 'Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat1/600/400' },
  { id: '9', name: 'Seated Cable Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablerow/600/400' },
  { id: '10', name: 'Pull-Ups', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/pullup/600/400' },
  
  // BENEN
  { id: '11', name: 'Barbell Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat1/600/400' },
  { id: '12', name: 'Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legpress1/600/400' },
  { id: '13', name: 'Leg Extension', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legext/600/400' },
  { id: '14', name: 'Lying Leg Curl', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/legcurl/600/400' },
  { id: '15', name: 'Romanian Deadlift', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/rdl/600/400' },
  { id: '16', name: 'Calf Raise', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/calf/600/400' },

  // SCHOUDERS
  { id: '17', name: 'Overhead Barbell Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/shoulder1/600/400' },
  { id: '18', name: 'Dumbbell Lateral Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },
  { id: '19', name: 'Arnold Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/arnold/600/400' },
  { id: '20', name: 'Face Pulls', muscleGroup: 'Schouders', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/facepull/600/400' },
  
  // ARMEN
  { id: '21', name: 'Barbell Bicep Curl', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bicep1/600/400' },
  { id: '22', name: 'Dumbbell Hammer Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hammer/600/400' },
  { id: '23', name: 'Tricep Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tricep1/600/400' },
  { id: '24', name: 'Skull Crusher', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },
  { id: '25', name: 'Dips', muscleGroup: 'Armen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/dips/600/400' },

  // BUIK
  { id: '26', name: 'Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '27', name: 'Hanging Leg Raise', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legraise/600/400' },
  { id: '28', name: 'Ab Wheel Rollout', muscleGroup: 'Buik', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/abwheel/600/400' },
  
  // CARDIO
  { id: '29', name: 'Running', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/run/600/400' },
  { id: '30', name: 'Rowing Machine', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 3, defaultReps: 500, imageUrl: 'https://picsum.photos/seed/rower/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v5');
  if (!stored) {
    localStorage.setItem('user_exercises_v5', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v5', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: [] };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v4') || '{}');
  return allStats[exerciseId] || { sets: [] };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v4') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: [] };
  }
  // Zorg dat we exact de set index onthouden
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_per_set_v4', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines_v4');
  if (!stored) {
    const exercises = getExercises();
    const initial = [
      { id: 'r1', name: 'Full Body Push/Pull', exercises: [exercises[0], exercises[10], exercises[6], exercises[16]] },
      { id: 'r2', name: 'Upper Body Focus', exercises: [exercises[0], exercises[6], exercises[17], exercises[20]] },
    ];
    localStorage.setItem('user_routines_v4', JSON.stringify(initial));
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
  localStorage.setItem('user_routines_v4', JSON.stringify(routines));
};
