
"use client"

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRoutines, getExercises, type Routine } from '@/lib/store';
import { Play, Calendar as CalendarIcon, Trophy, ArrowRight, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';

export default function HomePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRoutines(getRoutines());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-5 space-y-6">
      <header className="py-4">
        <h1 className="text-3xl font-extrabold text-primary">Welkom terug!</h1>
        <p className="text-muted-foreground">Klaar voor je volgende workout?</p>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-white border-none shadow-lg">
          <CardContent className="p-4 flex flex-col gap-1">
            <CalendarIcon className="h-5 w-5 mb-1 opacity-80" />
            <span className="text-2xl font-bold">{routines.filter(r => r.lastPerformed).length}</span>
            <span className="text-xs opacity-80 font-medium">Actieve routines</span>
          </CardContent>
        </Card>
        <Card className="bg-accent text-white border-none shadow-lg">
          <CardContent className="p-4 flex flex-col gap-1">
            <Trophy className="h-5 w-5 mb-1 opacity-80" />
            <span className="text-2xl font-bold">{getExercises().length}</span>
            <span className="text-xs opacity-80 font-medium">Oefeningen</span>
          </CardContent>
        </Card>
      </div>

      {/* Workout Calendar */}
      <WorkoutCalendar />

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold">Recente Routines</h2>
          <Link href="/routines" className="text-sm text-primary font-medium flex items-center gap-1">
            Alles tonen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {routines.slice(0, 3).map((routine) => (
            <Card key={routine.id} className="card-hover border-l-4" style={{ borderLeftColor: routine.color || '#8b5cf6' }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{routine.name}</h3>
                  <p className="text-xs text-muted-foreground">{routine.exercises.length} oefeningen</p>
                </div>
                <Link href={`/workout/${routine.id}`}>
                  <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" style={{ backgroundColor: routine.color || '#8b5cf6' }}>
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {routines.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground italic">Geen routines gevonden.</p>
              <Link href="/routines/new">
                <Button variant="link" className="text-primary font-bold">Maak je eerste routine</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/30 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">Ontdek oefeningen</h3>
            <p className="text-xs text-muted-foreground">Bekijk onze database met {getExercises().length}+ oefeningen.</p>
          </div>
        </div>
        <Link href="/exercises" className="block">
          <Button variant="outline" className="w-full rounded-xl">Oefeningen bekijken</Button>
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}
