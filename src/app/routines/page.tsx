"use client"

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRoutines, type Routine } from '@/lib/store';
import { Plus, Dumbbell, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  return (
    <div className="p-5 space-y-6">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Mijn Routines</h1>
        <Link href="/routines/new">
          <Button size="sm" className="bg-primary rounded-full">
            <Plus className="h-4 w-4 mr-1" /> Nieuw
          </Button>
        </Link>
      </header>

      <div className="space-y-4">
        {routines.map((routine) => (
          <Card key={routine.id} className="relative overflow-hidden card-hover">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">{routine.name}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {routine.exercises.length} Oefeningen
                    </span>
                  </div>
                </div>
                <Link href={`/workout/${routine.id}`}>
                  <Button className="bg-primary rounded-xl h-10 px-4">
                    <Play className="h-4 w-4 mr-2 fill-current" /> Start
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {routine.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Dumbbell className="h-3 w-3" />
                    <span>{ex.name}</span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <p className="text-xs text-muted-foreground italic pl-5">En {routine.exercises.length - 3} meer...</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {routines.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Je hebt nog geen routines aangemaakt.</p>
            <Link href="/routines/new">
              <Button className="bg-primary">Begin Nu</Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
