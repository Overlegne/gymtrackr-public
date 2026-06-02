"use client"

import { useEffect, useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getRoutines, 
  getExerciseStats, 
  saveAllWorkoutStats, 
  logWorkout,
  kgToDisplay,
  displayToKg,
  getProgressionSuggestion,
  startActiveWorkoutSession,
  getActiveWorkoutSession,
  type Routine, 
  type RoutineExercise,
  type ProgressionSuggestion
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Check, Timer, Minus, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { RestTimer } from '@/components/RestTimer';
import { getSettings } from '@/lib/settings-store';

// Required for static export
export function generateStaticParams() {
  return [];
}
export const dynamicParams = false;

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [suggestions, setSuggestions] = useState<Record<string, ProgressionSuggestion | null>>({});
  
  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';
  const weightStep = settings.unitSystem === 'Metric' ? 0.25 : 5;

  const [timerTrigger, setTimerTrigger] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(60);

  useEffect(() => {
    async function load() {
      setRestDuration(settings.defaultRestDuration);

      const existingSession = await getActiveWorkoutSession();
      if (existingSession && existingSession.routineId === id) {
        setSessionStartTime(existingSession.startTime);
      } else {
        const newStartTime = Date.now();
        setSessionStartTime(newStartTime);
        await startActiveWorkoutSession(id);
      }

      const routines = await getRoutines();
      const found = routines.find(r => r.id === id);
      if (found) {
        setRoutine(found);
        const initialized: RoutineExercise[] = [];
        const suggMap: Record<string, ProgressionSuggestion | null> = {};
        
        for (const ex of found.exercises) {
          const stats = await getExerciseStats(ex.id);
          suggMap[ex.id] = await getProgressionSuggestion(ex.id);
          initialized.push({
            ...ex,
            sets: Array.from({ length: ex.defaultSets }, (_, i) => {
              const prevSetStats = stats.sets[i.toString()] || stats.sets["0"] || null;
              return {
                reps: prevSetStats?.reps || ex.defaultReps,
                weight: prevSetStats?.weight || 0,
                durationSeconds: prevSetStats?.durationSeconds || ex.defaultDurationSeconds || 0,
                completed: false
              };
            })
          });
        }
        setExercises(initialized);
        setSuggestions(suggMap);
      }
    }
    load();
  }, [id, settings]);

  useEffect(() => {
    if (!sessionStartTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const toggleSet = (exIndex: number, setIndex: number) => {
    const newExs = [...exercises];
    const set = newExs[exIndex].sets[setIndex];
    const wasCompleted = set.completed;
    set.completed = !set.completed;
    if (!wasCompleted) {
      setTimerTrigger(Date.now());
      setShowTimer(true);
    }
    setExercises(newExs);
  };

  const updateSetWeight = (exIdx: number, setIdx: number, displayValue: number) => {
    const newExs = [...exercises];
    newExs[exIdx].sets[setIdx].weight = displayToKg(Math.max(0, displayValue), settings.unitSystem);
    setExercises(newExs);
  };

  const updateSetReps = (exIdx: number, setIdx: number, value: number) => {
    const newExs = [...exercises];
    newExs[exIdx].sets[setIdx].reps = Math.max(0, value);
    setExercises(newExs);
  };

  const formatElapsedTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (routine && sessionStartTime) {
      await saveAllWorkoutStats(exercises);
      const finalDur = Math.round((Date.now() - sessionStartTime) / 1000);
      await logWorkout(routine, finalDur, exercises.reduce((acc, ex) => acc + ex.sets.reduce((v, s) => v + (s.weight * s.reps), 0), 0));
      router.push('/workout/summary');
    }
  };

  if (!routine) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft className="h-6 w-6" /></Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate max-w-[150px]">{routine.name}</h1>
            <span className="text-[10px] font-black tabular-nums text-primary">{formatElapsedTime(elapsedTime)}</span>
          </div>
        </div>
        <Button onClick={handleFinish} className="font-bold rounded-xl px-6" style={{ backgroundColor: routine.color || '#8b5cf6' }}>Finish</Button>
      </header>

      <div className="p-5 space-y-6 pb-40">
        {exercises.map((ex, exIdx) => (
          <Card key={ex.id} className="border-none shadow-md overflow-hidden bg-card">
            <CardHeader className="pb-3" style={{ backgroundColor: `${routine.color}10` }}>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted">
                  <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                </div>
                <CardTitle className="text-lg">{ex.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ex.sets.map((set, setIdx) => (
                <div key={setIdx} className={`grid grid-cols-12 gap-2 p-3 items-center border-b last:border-0 ${set.completed ? 'bg-primary/5' : ''}`}>
                  <div className="col-span-2 text-center font-bold text-muted-foreground">{setIdx + 1}</div>
                  <div className="col-span-4 flex items-center bg-muted/30 rounded-lg p-1">
                    <button onClick={() => updateSetWeight(exIdx, setIdx, kgToDisplay(set.weight, settings.unitSystem) - weightStep)} className="h-8 w-8 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <div className="flex-1 text-center font-bold text-sm">{kgToDisplay(set.weight, settings.unitSystem)}</div>
                    <button onClick={() => updateSetWeight(exIdx, setIdx, kgToDisplay(set.weight, settings.unitSystem) + weightStep)} className="h-8 w-8 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="col-span-4 flex items-center bg-muted/30 rounded-lg p-1">
                    <button onClick={() => updateSetReps(exIdx, setIdx, set.reps - 1)} className="h-8 w-8 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <div className="flex-1 text-center font-bold text-sm">{set.reps}</div>
                    <button onClick={() => updateSetReps(exIdx, setIdx, set.reps + 1)} className="h-8 w-8 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => toggleSet(exIdx, setIdx)} className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${set.completed ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
                      <Check className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {showTimer && <RestTimer duration={restDuration} trigger={timerTrigger} onClose={() => setShowTimer(false)} />}
    </div>
  );
}
