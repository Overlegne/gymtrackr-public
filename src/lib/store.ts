
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
  // BORST (15)
  { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bench/600/400' },
  { id: '2', name: 'Incline Barbell Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/incbench/600/400' },
  { id: '3', name: 'Dumbbell Bench Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbbench/600/400' },
  { id: '4', name: 'Incline Dumbbell Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/incdb/600/400' },
  { id: '5', name: 'Chest Flys (Dumbbell)', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/flys/600/400' },
  { id: '6', name: 'Decline Bench Press', muscleGroup: 'Borst', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/decline/600/400' },
  { id: '7', name: 'Push-Ups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pushup/600/400' },
  { id: '39', name: 'Cable Chest Press', muscleGroup: 'Borst', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablechest/600/400' },
  { id: '40', name: 'Pec Deck Machine', muscleGroup: 'Borst', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/pecdeck/600/400' },
  { id: '41', name: 'Dips (Chest Focus)', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/dips/600/400' },
  { id: '42', name: 'Wide Grip Pushups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/widepush/600/400' },
  { id: '43', name: 'Diamond Pushups', muscleGroup: 'Borst', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/diamond/600/400' },
  { id: '44', name: 'Hammer Strength Chest Press', muscleGroup: 'Borst', equipment: 'Machine', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/hammerchest/600/400' },
  { id: '45', name: 'Low Cable Flys', muscleGroup: 'Borst', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lowcable/600/400' },
  { id: '46', name: 'Svends Press', muscleGroup: 'Borst', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/svend/600/400' },

  // RUG (20)
  { id: '8', name: 'Conventional Deadlift', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/deadlift/600/400' },
  { id: '9', name: 'Pull-Ups', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/pullup/600/400' },
  { id: '10', name: 'Wide Grip Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lat/600/400' },
  { id: '11', name: 'Bent Over Barbell Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/row/600/400' },
  { id: '12', name: 'Seated Cable Row', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablerow/600/400' },
  { id: '13', name: 'T-Bar Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/tbar/600/400' },
  { id: '14', name: 'Face Pulls', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/facepull/600/400' },
  { id: '47', name: 'Chin-Ups', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/chinup/600/400' },
  { id: '48', name: 'Single Arm Dumbbell Row', muscleGroup: 'Rug', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbrow/600/400' },
  { id: '49', name: 'Reverse Grip Lat Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/revlat/600/400' },
  { id: '50', name: 'Straight Arm Pulldown', muscleGroup: 'Rug', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/straight/600/400' },
  { id: '51', name: 'Barbell Shrugs', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/shrug/600/400' },
  { id: '52', name: 'Hyperextensions', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/hyper/600/400' },
  { id: '53', name: 'Pendlay Row', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/pendlay/600/400' },
  { id: '54', name: 'Rack Pulls', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/rack/600/400' },
  { id: '55', name: 'V-Bar Pulldown', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/vlat/600/400' },
  { id: '56', name: 'Machine Row', muscleGroup: 'Rug', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/machinerow/600/400' },
  { id: '57', name: 'Good Mornings', muscleGroup: 'Rug', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/goodmorning/600/400' },
  { id: '58', name: 'Renegade Rows', muscleGroup: 'Rug', equipment: 'Halter', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/renegade/600/400' },
  { id: '59', name: 'Superman', muscleGroup: 'Rug', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/superman/600/400' },

  // BENEN (25)
  { id: '15', name: 'Barbell Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/squat/600/400' },
  { id: '16', name: 'Leg Press Machine', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lpress/600/400' },
  { id: '17', name: 'Romanian Deadlift', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/rdl/600/400' },
  { id: '18', name: 'Leg Extensions', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lext/600/400' },
  { id: '19', name: 'Lying Leg Curls', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/lcurl/600/400' },
  { id: '20', name: 'Goblet Squats', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/goblet/600/400' },
  { id: '21', name: 'Calf Raises (Standing)', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/calf/600/400' },
  { id: '60', name: 'Front Squat', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/frontsquat/600/400' },
  { id: '61', name: 'Bulgarian Split Squats', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/bulgarian/600/400' },
  { id: '62', name: 'Walking Lunges', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/lunges/600/400' },
  { id: '63', name: 'Hack Squat Machine', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hacksquat/600/400' },
  { id: '64', name: 'Hip Thrusts', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hipthrust/600/400' },
  { id: '65', name: 'Sumo Deadlift', muscleGroup: 'Benen', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/sumodead/600/400' },
  { id: '66', name: 'Step-Ups', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/stepups/600/400' },
  { id: '67', name: 'Seated Leg Curl', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/seatedcurl/600/400' },
  { id: '68', name: 'Glute Ham Raise', muscleGroup: 'Benen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/ghr/600/400' },
  { id: '69', name: 'Adductor Machine', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/adductor/600/400' },
  { id: '70', name: 'Abductor Machine', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/abductor/600/400' },
  { id: '71', name: 'Seated Calf Raise', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/seatedcalf/600/400' },
  { id: '72', name: 'Box Jumps', muscleGroup: 'Benen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/boxjumps/600/400' },
  { id: '73', name: 'Pistol Squats', muscleGroup: 'Benen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/pistol/600/400' },
  { id: '74', name: 'Single Leg Deadlift', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/sldl/600/400' },
  { id: '75', name: 'Wall Sit', muscleGroup: 'Benen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/wallsit/600/400' },
  { id: '76', name: 'Calf Press on Leg Press', muscleGroup: 'Benen', equipment: 'Machine', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/calfpress/600/400' },
  { id: '77', name: 'Kettlebell Swings', muscleGroup: 'Benen', equipment: 'Halter', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/kbswings/600/400' },

  // SCHOUDERS (15)
  { id: '22', name: 'Overhead Barbell Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/opress/600/400' },
  { id: '23', name: 'Dumbbell Shoulder Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/dbpress/600/400' },
  { id: '24', name: 'Dumbbell Lateral Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lateral/600/400' },
  { id: '25', name: 'Arnold Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/arnold/600/400' },
  { id: '26', name: 'Rear Delt Flys', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/reardelt/600/400' },
  { id: '78', name: 'Cable Lateral Raise', muscleGroup: 'Schouders', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/cablelateral/600/400' },
  { id: '79', name: 'Front Dumbbell Raise', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/frontraise/600/400' },
  { id: '80', name: 'Upright Row', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/upright/600/400' },
  { id: '81', name: 'Push Press', muscleGroup: 'Schouders', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, imageUrl: 'https://picsum.photos/seed/pushpress/600/400' },
  { id: '82', name: 'Dumbbell Rear Delt Row', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/rearow/600/400' },
  { id: '83', name: 'Smith Machine Shoulder Press', muscleGroup: 'Schouders', equipment: 'Machine', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/smithpress/600/400' },
  { id: '84', name: 'Handstand Pushups', muscleGroup: 'Schouders', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 5, imageUrl: 'https://picsum.photos/seed/handstand/600/400' },
  { id: '85', name: 'Bus Driver', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/busdriver/600/400' },
  { id: '86', name: 'Egyptian Lateral Raise', muscleGroup: 'Schouders', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/egyptian/600/400' },
  { id: '87', name: 'Cuban Press', muscleGroup: 'Schouders', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/cuban/600/400' },

  // ARMEN (15)
  { id: '27', name: 'Barbell Bicep Curl', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/bcurl/600/400' },
  { id: '28', name: 'Dumbbell Hammer Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/hcurl/600/400' },
  { id: '29', name: 'Preacher Curls', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/pcurl/600/400' },
  { id: '30', name: 'Cable Tricep Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/tpush/600/400' },
  { id: '31', name: 'Skull Crushers', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/skull/600/400' },
  { id: '32', name: 'Overhead Tricep Extension', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/toverhead/600/400' },
  { id: '88', name: 'Close Grip Bench Press', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/closegrip/600/400' },
  { id: '89', name: 'Concentration Curls', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/concentration/600/400' },
  { id: '90', name: 'Tricep Kickbacks', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/kickback/600/400' },
  { id: '91', name: 'Spider Curls', muscleGroup: 'Armen', equipment: 'Barbell', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/spider/600/400' },
  { id: '92', name: 'Rope Pushdown', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/ropepush/600/400' },
  { id: '93', name: 'Zottman Curls', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/zottman/600/400' },
  { id: '94', name: 'Bench Dips', muscleGroup: 'Armen', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/benchdips/600/400' },
  { id: '95', name: 'Incline Dumbbell Curl', muscleGroup: 'Armen', equipment: 'Halter', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/inclinecurl/600/400' },
  { id: '96', name: 'Cable Bicep Curl', muscleGroup: 'Armen', equipment: 'Kabel', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/cablecurl/600/400' },

  // BUIK (15)
  { id: '33', name: 'Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, imageUrl: 'https://picsum.photos/seed/plank/600/400' },
  { id: '34', name: 'Hanging Leg Raises', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/lraise/600/400' },
  { id: '35', name: 'Russian Twists', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/twist/600/400' },
  { id: '97', name: 'Crunches', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 25, imageUrl: 'https://picsum.photos/seed/crunches/600/400' },
  { id: '98', name: 'Bicycle Crunches', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 30, imageUrl: 'https://picsum.photos/seed/bicycle/600/400' },
  { id: '99', name: 'Ab Roller', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/abroller/600/400' },
  { id: '100', name: 'Cable Crunch', muscleGroup: 'Buik', equipment: 'Kabel', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/cablecrunch/600/400' },
  { id: '101', name: 'V-Ups', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/vups/600/400' },
  { id: '102', name: 'Mountain Climbers', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 40, imageUrl: 'https://picsum.photos/seed/climbers/600/400' },
  { id: '103', name: 'Side Plank', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 45, imageUrl: 'https://picsum.photos/seed/sideplank/600/400' },
  { id: '104', name: 'Dead Bug', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 12, imageUrl: 'https://picsum.photos/seed/deadbug/600/400' },
  { id: '105', name: 'Toe Touches', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/toetouch/600/400' },
  { id: '106', name: 'Reverse Crunches', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/revcrunch/600/400' },
  { id: '107', name: 'Heel Touches', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 30, imageUrl: 'https://picsum.photos/seed/heeltouch/600/400' },
  { id: '108', name: 'Leg Tucks', muscleGroup: 'Buik', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/legtuck/600/400' },

  // CARDIO (10)
  { id: '36', name: 'Treadmill Running', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/run/600/400' },
  { id: '37', name: 'Rowing Machine', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 3, defaultReps: 500, imageUrl: 'https://picsum.photos/seed/rower/600/400' },
  { id: '38', name: 'Stationary Bike', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/bike/600/400' },
  { id: '109', name: 'Jump Rope', muscleGroup: 'Cardio', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 100, imageUrl: 'https://picsum.photos/seed/jumprope/600/400' },
  { id: '110', name: 'Burpees', muscleGroup: 'Cardio', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, imageUrl: 'https://picsum.photos/seed/burpee/600/400' },
  { id: '111', name: 'Elliptical Trainer', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 20, imageUrl: 'https://picsum.photos/seed/elliptical/600/400' },
  { id: '112', name: 'Stair Climber', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 1, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/stairs/600/400' },
  { id: '113', name: 'Swimming Laps', muscleGroup: 'Cardio', equipment: 'Bodyweight', defaultSets: 1, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/swim/600/400' },
  { id: '114', name: 'Assault Bike', muscleGroup: 'Cardio', equipment: 'Machine', defaultSets: 3, defaultReps: 10, imageUrl: 'https://picsum.photos/seed/assault/600/400' },
  { id: '115', name: 'Shadow Boxing', muscleGroup: 'Cardio', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 180, imageUrl: 'https://picsum.photos/seed/boxing/600/400' },
];

export const getExercises = (): Exercise[] => {
  if (typeof window === 'undefined') return DEFAULT_EXERCISES;
  const stored = localStorage.getItem('user_exercises_v8');
  if (!stored) {
    localStorage.setItem('user_exercises_v8', JSON.stringify(DEFAULT_EXERCISES));
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
  localStorage.setItem('user_exercises_v8', JSON.stringify(exercises));
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
