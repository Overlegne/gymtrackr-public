
"use client"

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getExercises, type Exercise, type MuscleGroup } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';
import Image from 'next/image';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Alle'>('Alle');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  const muscleGroups: (MuscleGroup | 'Alle')[] = ['Alle', 'Borst', 'Rug', 'Benen', 'Schouders', 'Armen', 'Buik', 'Cardio'];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Alle' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleExerciseAdded = () => {
    setExercises(getExercises());
  };

  return (
    <div className="p-5 space-y-6">
      <header className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Oefeningen</h1>
          <p className="text-muted-foreground text-sm">Vind de juiste oefening voor je training.</p>
        </div>
        <AddExerciseDialog onExerciseAdded={handleExerciseAdded} />
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Zoek oefening..." 
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

      <div className="space-y-3">
        {filtered.map(ex => (
          <Card key={ex.id} className="card-hover overflow-hidden">
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
            <p className="text-muted-foreground">Geen oefeningen gevonden.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
