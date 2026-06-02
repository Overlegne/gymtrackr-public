
"use client"

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRoutines, getExercises, type Routine } from '@/lib/store';
import { Play, Trophy, ArrowRight, Dumbbell, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercisesCount, setExercisesCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRoutines(getRoutines());
    setExercisesCount(getExercises().length);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-5 space-y-6">
      <header className="py-4">
        <h1 className="text-3xl font-extrabold text-primary">Welcome back!</h1>
        <p className="text-muted-foreground font-medium">Ready for your next workout?</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardContent className="p-4 flex flex-col gap-1">
            <CalendarIcon className="h-5 w-5 mb-1 opacity-80" />
            <span className="text-2xl font-black">{routines.length}</span>
            <span className="text-[10px] opacity-80 font-black uppercase tracking-widest">My Routines</span>
          </CardContent>
        </Card>
        <Card className="bg-accent text-accent-foreground border-none shadow-lg">
          <CardContent className="p-4 flex flex-col gap-1">
            <Trophy className="h-5 w-5 mb-1 opacity-80" />
            <span className="text-2xl font-black">{exercisesCount}</span>
            <span className="text-[10px] opacity-80 font-black uppercase tracking-widest">Exercises</span>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-black tracking-tight">Recent Routines</h2>
          <Link href="/routines" className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {routines.map((routine) => (
            <Card key={routine.id} className="card-hover border-none bg-card shadow-sm overflow-hidden border-l-4" style={{ borderLeft: `4px solid ${routine.color || 'hsl(var(--primary))'}` }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-foreground">{routine.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{routine.exercises.length} exercises</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/workout/${routine.id}`}>
                    <Button size="icon" className="rounded-full h-12 w-12 shadow-md hover:scale-105 transition-transform" style={{ backgroundColor: routine.color || 'hsl(var(--primary))' }}>
                      <Play className="h-5 w-5 fill-white text-white" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {routines.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-muted rounded-[2rem] bg-muted/20">
              <p className="text-muted-foreground font-medium text-sm italic">No routines found.</p>
              <Link href="/routines/new">
                <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest">Create your first routine</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-card border border-border/40 p-6 rounded-[2rem] space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-foreground">Discover Exercises</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Browse our database with {exercisesCount}+ movements</p>
          </div>
        </div>
        <Link href="/exercises" className="block">
          <Button variant="outline" className="w-full rounded-xl font-black uppercase text-[10px] tracking-widest h-11">View Library</Button>
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}
