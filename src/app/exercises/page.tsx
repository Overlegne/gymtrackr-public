
"use client"

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getExercises, getExerciseStats, type Exercise, type MuscleGroup } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, Info, Dumbbell, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  const selectedStats = selectedExercise ? getExerciseStats(selectedExercise.id) : null;
  const lastSet = selectedStats && Object.keys(selectedStats.sets).length > 0 
    ? selectedStats.sets[0] // Showing first set as a summary
    : null;

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
                <DialogDescription className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="rounded-full px-3">{selectedExercise.muscleGroup}</Badge>
                  <Badge variant="outline" className="rounded-full px-3">{selectedExercise.equipment}</Badge>
                </DialogDescription>
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
                    <Info className="h-4 w-4 text-primary" />
                    Personal Progress
                  </h4>
                  {lastSet ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Last weight</p>
                          <p className="text-xl font-extrabold text-primary">{lastSet.weight} kg</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-medium">Reps per set</p>
                          <p className="text-xl font-extrabold text-primary">{lastSet.reps}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/20 border border-dashed rounded-2xl p-6 text-center">
                      <p className="text-sm text-muted-foreground italic">No history logged yet. Start a workout to track your progress!</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Consistent form and progressive overload are key to success. Use this exercise as part of your routine to see results over time.
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
