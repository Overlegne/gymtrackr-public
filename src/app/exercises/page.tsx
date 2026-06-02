
"use client"

import { useState, useEffect, useMemo } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getExercises, getExerciseStats, type Exercise, type MuscleGroup } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, History, Dumbbell, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleExerciseAdded = () => {
    setExercises(getExercises());
  };

  // Memoize stats to ensure UI updates when selectedExercise changes
  const loggedSets = useMemo(() => {
    if (!selectedExercise) return [];
    const stats = getExerciseStats(selectedExercise.id);
    if (!stats.sets) return [];
    
    return Object.entries(stats.sets)
      .map(([idx, values]) => ({
        index: parseInt(idx),
        weight: values.weight,
        reps: values.reps
      }))
      .sort((a, b) => a.index - b.index);
  }, [selectedExercise]);

  return (
    <div className="p-5 space-y-6">
      <header className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Exercises</h1>
          <p className="text-muted-foreground text-sm">Find the right exercise for your training.</p>
        </div>
        <AddExerciseDialog onExerciseAdded={handleExerciseAdded} />
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search exercises..." 
          className="pl-10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {muscleGroups.map(muscle => (
          <Badge 
            key={muscle}
            variant={selectedMuscle === muscle ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full"
            onClick={() => setSelectedMuscle(muscle)}
          >
            {muscle}
          </Badge>
        ))}
      </div>

      <div className="space-y-3 pb-20">
        {filtered.map(ex => (
          <Card 
            key={ex.id} 
            className="card-hover overflow-hidden cursor-pointer"
            onClick={() => setSelectedExercise(ex)}
          >
            <CardContent className="p-0 flex items-center">
              <div className="relative h-20 w-24 shrink-0 bg-muted">
                <Image 
                  src={ex.imageUrl} 
                  alt={ex.name} 
                  fill 
                  className="object-cover"
                  data-ai-hint="gym exercise"
                />
              </div>
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{ex.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{ex.muscleGroup}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">•</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{ex.equipment}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No exercises found.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="sm:max-w-md rounded-t-[2rem] sm:rounded-lg max-h-[90vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedExercise.name}</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="rounded-full px-3">{selectedExercise.muscleGroup}</Badge>
                  <Badge variant="outline" className="rounded-full px-3">{selectedExercise.equipment}</Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted shadow-inner">
                  <Image 
                    src={selectedExercise.imageUrl} 
                    alt={selectedExercise.name} 
                    fill 
                    className="object-cover"
                    data-ai-hint="gym exercise instruction"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Muscle</p>
                      <p className="font-bold">{selectedExercise.muscleGroup}</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Equipment</p>
                      <p className="font-bold">{selectedExercise.equipment}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Performance History
                  </h4>
                  {loggedSets.length > 0 ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3">
                      <p className="text-xs text-muted-foreground font-medium border-b pb-2">Last recorded workout values:</p>
                      {loggedSets.map((set) => (
                        <div key={set.index} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-muted-foreground">Set {set.index + 1}</span>
                          <div className="flex gap-4">
                            <span className="font-extrabold text-primary">{set.weight} kg</span>
                            <span className="text-muted-foreground">×</span>
                            <span className="font-extrabold text-primary">{set.reps} reps</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/20 border border-dashed rounded-2xl p-8 text-center">
                      <p className="text-sm text-muted-foreground italic">No history logged yet. Complete a workout to see your progress here!</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tip: Focus on progressive overload. Try to slightly increase the weight or reps compared to your previous session to see constant improvement.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
