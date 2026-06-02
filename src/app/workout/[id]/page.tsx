
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
import { ChevronLeft, Check, Timer, Minus, Plus, Clock, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { RestTimer } from '@/components/RestTimer';
import { getSettings } from '@/lib/settings-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [suggestions, setSuggestions] = useState<Record<string, ProgressionSuggestion | null>>({});
  
  // Settings
  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';
  const weightStep = settings.unitSystem === 'Metric' ? 0.25 : 5;

  // Timer State
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

  const updateSetDuration = (exIdx: number, setIdx: number, value: number) => {
    const newExs = [...exercises];
    newExs[exIdx].sets[setIdx].durationSeconds = Math.max(0, value);
    setExercises(newExs);
  };

  const formatElapsedTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (routine && sessionStartTime) {
      const processed = exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => ({
          ...s,
          completed: s.completed || s.weight > 0 || s.reps > 0 || (s.durationSeconds && s.durationSeconds > 0)
        }))
      }));
      await saveAllWorkoutStats(processed);
      const finalDur = Math.round((Date.now() - sessionStartTime) / 1000);
      await logWorkout(routine, finalDur, processed.reduce((acc, ex) => acc + ex.sets.reduce((v, s) => v + (s.weight * s.reps), 0), 0));
      router.push('/workout/summary');
    } else {
      router.push('/');
    }
  };

  if (!routine) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate max-w-[150px]">{routine.name}</h1>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                <Timer className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[10px] font-black tabular-nums text-primary tracking-tight">
                  {formatElapsedTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleFinish} className="hover:opacity-90 text-primary-foreground font-bold rounded-xl px-6" style={{ backgroundColor: routine.color || '#8b5cf6' }}>
          Finish
        </Button>
      </header>

      <div className="p-5 space-y-6 pb-40">
        {exercises.map((ex, exIdx) => {
          const suggestion = suggestions[ex.id];
          return (
            <Card key={ex.id} className="border-none shadow-md overflow-hidden bg-card">
              <CardHeader className="pb-3" style={{ backgroundColor: `${routine.color}10` }}>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted shrink-0">
                      <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">{ex.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase border-border">{ex.muscleGroup}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {suggestion && (
                <div className="mx-4 mt-2 mb-0">
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex gap-3 items-start">
                    <div className="h-7 w-7 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest">Coach's Suggestion</p>
                      <span className="text-xs font-black text-foreground truncate">
                        {suggestion.type === 'increase_duration' ? `Hold for ${suggestion.suggestedDuration}s` : `${suggestion.suggestedWeight ? kgToDisplay(suggestion.suggestedWeight, settings.unitSystem) + unitLabel : ''} x ${suggestion.suggestedReps} reps`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <CardContent className="p-0">
                {ex.sets.map((set, setIdx) => {
                  const displayWeight = kgToDisplay(set.weight, settings.unitSystem);
                  return (
                    <div key={setIdx} className={`grid grid-cols-12 gap-2 p-3 items-center border-b border-border last:border-0 ${set.completed ? 'bg-primary/5' : ''}`}>
                      <div className="col-span-2 text-center font-bold text-muted-foreground">{setIdx + 1}</div>
                      {ex.loggingType === 'duration' ? (
                        <div className="col-span-8 flex items-center bg-muted/30 rounded-lg p-1">
                          <button onClick={() => updateSetDuration(exIdx, setIdx, (set.durationSeconds || 0) - 5)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Minus className="h-3 w-3" /></button>
                          <div className="flex-1 text-center font-bold text-sm">{(set.durationSeconds || 0)}s</div>
                          <button onClick={() => updateSetDuration(exIdx, setIdx, (set.durationSeconds || 0) + 5)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Plus className="h-3 w-3" /></button>
                        </div>
                      ) : (
                        <>
                          <div className="col-span-4 flex items-center bg-muted/30 rounded-lg p-1">
                            <button onClick={() => updateSetWeight(exIdx, setIdx, displayWeight - weightStep)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Minus className="h-3 w-3" /></button>
                            <input type="number" step={weightStep} value={displayWeight} onChange={(e) => updateSetWeight(exIdx, setIdx, parseFloat(e.target.value) || 0)} disabled={set.completed} className="w-full bg-transparent text-center font-bold text-sm focus:outline-none" />
                            <button onClick={() => updateSetWeight(exIdx, setIdx, displayWeight + weightStep)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Plus className="h-3 w-3" /></button>
                          </div>
                          <div className="col-span-4 flex items-center bg-muted/30 rounded-lg p-1">
                            <button onClick={() => updateSetReps(exIdx, setIdx, set.reps - 1)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Minus className="h-3 w-3" /></button>
                            <input type="number" value={set.reps} onChange={(e) => updateSetReps(exIdx, setIdx, parseInt(e.target.value) || 0)} disabled={set.completed} className="w-full bg-transparent text-center font-bold text-sm focus:outline-none" />
                            <button onClick={() => updateSetReps(exIdx, setIdx, set.reps + 1)} className="h-8 w-8 flex items-center justify-center" disabled={set.completed}><Plus className="h-3 w-3" /></button>
                          </div>
                        </>
                      )}
                      <div className="col-span-2 flex justify-end">
                        <button onClick={() => toggleSet(exIdx, setIdx)} className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${set.completed ? 'bg-primary text-primary-foreground' : 'border border-border'}`}>
                          <Check className={`h-5 w-5 ${set.completed ? 'stroke-[3px]' : 'stroke-1'}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showTimer && <RestTimer duration={restDuration} trigger={timerTrigger} onClose={() => setShowTimer(false)} />}
    </div>
  );
}
