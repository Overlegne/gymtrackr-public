
"use client"

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getRoutines, 
  getExerciseStats, 
  saveAllWorkoutStats, 
  logWorkout,
  type Routine, 
  type RoutineExercise 
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Check, Timer, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);

  useEffect(() => {
    const routines = getRoutines();
    const found = routines.find(r => r.id === id);
    if (found) {
      setRoutine(found);
      const initialized = found.exercises.map(ex => {
        const stats = getExerciseStats(ex.id);
        return {
          ...ex,
          sets: Array.from({ length: ex.defaultSets }, (_, i) => {
            const prevSetStats = stats.sets[i.toString()] || stats.sets["0"] || null;
            return {
              reps: prevSetStats?.reps || ex.defaultReps,
              weight: prevSetStats?.weight || 0,
              completed: false
            };
          })
        };
      });
      setExercises(initialized);
    }
  }, [id]);

  const toggleSet = (exIndex: number, setIndex: number) => {
    const newExs = [...exercises];
    const set = newExs[exIndex].sets[setIndex];
    set.completed = !set.completed;
    setExercises(newExs);
  };

  const updateSet = (exIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newExs = [...exercises];
    newExs[exIndex].sets[setIndex][field] = Math.max(0, value);
    setExercises(newExs);
  };

  const handleFinish = () => {
    if (routine) {
      // Mark all non-zero sets as completed for saving logic
      const processedExercises = exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => ({
          ...s,
          completed: s.completed || s.weight > 0 || s.reps > 0
        }))
      }));
      
      logWorkout(routine);
      saveAllWorkoutStats(processedExercises);
    }
    toast({
      title: "Workout Completed!",
      description: "Great job. Your progress has been saved to your history.",
    });
    router.push('/');
  };

  if (!routine) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-white border-b px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold truncate max-w-[150px]">{routine.name}</h1>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Timer className="h-3 w-3" />
              <span>Training now...</span>
            </div>
          </div>
        </div>
        <Button onClick={handleFinish} className="hover:opacity-90 text-white font-bold rounded-xl px-6" style={{ backgroundColor: routine.color || '#8b5cf6' }}>
          Finish
        </Button>
      </header>

      <div className="p-5 space-y-6 pb-20">
        {exercises.map((ex, exIdx) => (
          <Card key={ex.id} className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-3" style={{ backgroundColor: `${routine.color}10` }}>
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted shrink-0">
                    <Image 
                      src={ex.imageUrl} 
                      alt={ex.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint="gym exercise"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ex.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase">{ex.muscleGroup}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 gap-2 p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">
                <div className="col-span-2 text-center">Set</div>
                <div className="col-span-4 text-center">Weight (kg)</div>
                <div className="col-span-4 text-center">Reps</div>
                <div className="col-span-2"></div>
              </div>
              
              {ex.sets.map((set, setIdx) => (
                <div 
                  key={setIdx} 
                  className={`grid grid-cols-12 gap-2 p-3 items-center border-b last:border-0 transition-colors ${set.completed ? 'bg-green-50' : ''}`}
                >
                  <div className="col-span-2 text-center font-bold text-muted-foreground">{setIdx + 1}</div>
                  
                  <div className="col-span-4 flex items-center bg-muted/50 rounded-lg p-1">
                    <button 
                      onClick={() => updateSet(exIdx, setIdx, 'weight', set.weight - 2.5)}
                      className="h-8 w-8 flex items-center justify-center disabled:opacity-30"
                      disabled={set.completed}
                      style={{ color: routine.color }}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                      disabled={set.completed}
                      className="w-full bg-transparent text-center font-bold text-sm focus:outline-none"
                    />
                    <button 
                      onClick={() => updateSet(exIdx, setIdx, 'weight', set.weight + 2.5)}
                      className="h-8 w-8 flex items-center justify-center disabled:opacity-30"
                      disabled={set.completed}
                      style={{ color: routine.color }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="col-span-4 flex items-center bg-muted/50 rounded-lg p-1">
                    <button 
                      onClick={() => updateSet(exIdx, setIdx, 'reps', set.reps - 1)}
                      className="h-8 w-8 flex items-center justify-center disabled:opacity-30"
                      disabled={set.completed}
                      style={{ color: routine.color }}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                      disabled={set.completed}
                      className="w-full bg-transparent text-center font-bold text-sm focus:outline-none"
                    />
                    <button 
                      onClick={() => updateSet(exIdx, setIdx, 'reps', set.reps + 1)}
                      className="h-8 w-8 flex items-center justify-center disabled:opacity-30"
                      disabled={set.completed}
                      style={{ color: routine.color }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => toggleSet(exIdx, setIdx)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        set.completed 
                          ? 'bg-green-500 text-white shadow-inner scale-90' 
                          : 'border'
                      }`}
                      style={!set.completed ? { backgroundColor: `${routine.color}10`, color: routine.color, borderColor: `${routine.color}20` } : {}}
                    >
                      <Check className={`h-5 w-5 ${set.completed ? 'stroke-[3px]' : 'stroke-1'}`} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full font-bold gap-2 h-10 rounded-xl"
                  style={{ backgroundColor: `${routine.color}05`, color: routine.color }}
                  onClick={() => {
                    const stats = getExerciseStats(ex.id);
                    const newExs = [...exercises];
                    const nextSetIdx = newExs[exIdx].sets.length;
                    const prevSetStats = stats.sets[nextSetIdx.toString()] || stats.sets["0"] || null;
                    newExs[exIdx].sets.push({
                      reps: prevSetStats?.reps || ex.defaultReps,
                      weight: prevSetStats?.weight || 0,
                      completed: false
                    });
                    setExercises(newExs);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Set
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
