import { normalizeExerciseName, type Exercise } from './store';

/**
 * Intelligent matcher to map imported exercise text to our local database.
 */
export function matchExerciseToDatabase(text: string, allExercises: Exercise[]): { exercise: Exercise | null, confidence: number } {
  const normalizedInput = normalizeExerciseName(text);

  // 1. Exact Name Match (Normalized)
  const exactMatch = allExercises.find(ex => normalizeExerciseName(ex.name) === normalizedInput);
  if (exactMatch) return { exercise: exactMatch, confidence: 1.0 };

  // 2. Exact ID Match
  const idMatch = allExercises.find(ex => ex.id === text);
  if (idMatch) return { exercise: idMatch, confidence: 1.0 };

  // 3. Alias / Partial Match (Common gym terms)
  const lowerInput = text.toLowerCase().trim();
  const aliases: Record<string, string[]> = {
    'bankdruk': ['barbell_bench_press', 'barbell bench press'],
    'bench': ['barbell_bench_press', 'barbell bench press'],
    'squat': ['barbell_squat', 'barbell squat'],
    'deadlift': ['barbell_deadlift', 'barbell deadlift'],
    'lat pulldown': ['wide_grip_pulldown'],
    'pulldown': ['wide_grip_pulldown'],
    'fly': ['dumbbell_fly', 'pec_deck'],
    'chest press': ['chest_press_machine'],
    'shoulder press': ['dumbbell_shoulder_press', 'overhead_press'],
    'curls': ['barbell_curl', 'hammer_curl'],
    'extensions': ['triceps_pressdown', 'leg_extension'],
    'rows': ['seated_cable_row', 'barbell_row'],
    'optrekken': ['pull_up'],
    'dippen': ['dips'],
  };

  for (const [key, ids] of Object.entries(aliases)) {
    if (lowerInput.includes(key)) {
      const match = allExercises.find(ex => ids.includes(ex.id) || ids.includes(ex.name.toLowerCase()));
      if (match) return { exercise: match, confidence: 0.8 };
    }
  }

  // 4. Fuzzy / Soft Match (Check if input is contained in any name)
  const partialMatch = allExercises.find(ex => 
    ex.name.toLowerCase().includes(lowerInput) || lowerInput.includes(ex.name.toLowerCase())
  );
  if (partialMatch) return { exercise: partialMatch, confidence: 0.6 };

  return { exercise: null, confidence: 0 };
}
