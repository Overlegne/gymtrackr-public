
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
  lastPerformed?: Date;
}

export const DEFAULT_EXERCISES: Exercise[] = [
  // BORST
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench/600/400' },
  { id: '2', name: 'Incline Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/incbench/600/400' },
  { id: '3', name: 'Dumbbell Bench Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbbench/600/400' },
  { id: '4', name: 'Incline Dumbbell Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/incdb/600/400' },
  { id: '5', name: 'Chest Flys (Dumbbell)', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/flys/600/400' },
  { id: '6', name: 'Decline Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/decline/600/400' },
  { id: '7', name: 'Push-Ups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  
  // RUG
  { id: '8', name: 'Conventional Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift/600/400' },
  { id: '9', name: 'Pull-Ups', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/pullup/600/400' },
  { id: '10', name: 'Wide Grip Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat/600/400' },
  { id: '11', name: 'Bent Over Barbell Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/row/600/400' },
  { id: '12', name: 'Seated Cable Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablerow/600/400' },
  { id: '13', name: 'T-Bar Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/tbar/600/400' },
  { id: '14', name: 'Face Pulls', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/facepull/600/400' },
  
  // BENEN
  { id: '15', name: 'Barbell Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat/600/400' },
  { id: '16', name: 'Leg Press Machine', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lpress/600/400' },
  { id: '17', name: 'Romanian Deadlift', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/rdl/600/400' },
  { id: '18', name: 'Leg Extensions', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lext/600/400' },
  { id: '19', name: 'Lying Leg Curls', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lcurl/600/400' },
  { id: '20', name: 'Goblet Squats', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/goblet/600/400' },
  { id: '21', name: 'Calf Raises (Standing)', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/calf/600/400' },

  // SCHOUDERS
  { id: '22', name: 'Overhead Barbell Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/opress/600/400' },
  { id: '23', name: 'Dumbbell Shoulder Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbpress/600/400' },
  { id: '24', name: 'Dumbbell Lateral Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },
  { id: '25', name: 'Arnold Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/arnold/600/400' },
  { id: '26', name: 'Rear Delt Flys', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/reardelt/600/400' },
  
  // ARMEN
  { id: '27', name: 'Barbell Bicep Curl', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bcurl/600/400' },
  { id: '28', name: 'Dumbbell Hammer Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hcurl/600/400' },
  { id: '29', name: 'Preacher Curls', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/pcurl/600/400' },
  { id: '30', name: 'Cable Tricep Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tpush/600/400' },
  { id: '31', name: 'Skull Crushers', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },
  { id: '32', name: 'Overhead Tricep Extension', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/toverhead/600/400' },

  // BUIK
  { id: '33', name: 'Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '34', name: 'Hanging Leg Raises', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lraise/600/400' },
  { id: '35', name: 'Russian Twists', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/twist/600/400' },
  
  // CARDIO
  { id: '36', name: 'Treadmill Running', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/run/600/400' },
  { id: '37', name: 'Rowing Machine', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 3, defaultReps: 500, imageUrl: 'https://picsum.photos/seed/rower/600/400' },
  { id: '38', name: 'Stationary Bike', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/bike/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v7');
  if (!stored) {
    localStorage.setItem('user_exercises_v7', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v7', JSON.stringify(exercises));
  return newExercise;
};

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  if (typeof window === 'undefined') return { sets: {} };
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v5') || '{}');
  return allStats[exerciseId] || { sets: {} };
};

export const saveExerciseSetStats = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
  if (typeof window === 'undefined') return;
  const allStats = JSON.parse(localStorage.getItem('exercise_stats_per_set_v5') || '{}');
  if (!allStats[exerciseId]) {
    allStats[exerciseId] = { sets: {} };
  }
  allStats[exerciseId].sets[setIndex] = { weight, reps };
  localStorage.setItem('exercise_stats_per_set_v5', JSON.stringify(allStats));
};

export const getRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('user_routines_v5');
  if (!stored) {
    const exercises = getExercises();
    const initial = [
      { id: 'r1', name: 'Full Body Kracht', exercises: [exercises[0], exercises[14], exercises[7], exercises[20]] },
      { id: 'r2', name: 'Bovenlichaam Focus', exercises: [exercises[0], exercises[7], exercises[21], exercises[25]] },
    ];
    localStorage.setItem('user_routines_v5', JSON.stringify(initial));
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
  localStorage.setItem('user_routines_v5', JSON.stringify(routines));
};
