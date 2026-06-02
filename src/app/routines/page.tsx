"use client"

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRoutines, deleteRoutine, type Routine } from '@/lib/store';
import { Plus, Dumbbell, Play, Trash2, FileUp, Edit2 } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setRoutines(await getRoutines());
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteRoutine(id);
    setRoutines(await getRoutines());
  };

  return (
    <div className="p-5 space-y-6 bg-background min-h-screen pt-[calc(1rem+var(--safe-top))]">
      <header className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Routines</h1>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Your training templates</p>
        </div>
        <div className="flex gap-2">
          <Link href="/routines/import">
            <Button variant="outline" size="sm" className="rounded-full px-4 font-black uppercase text-[10px] tracking-widest h-9 bg-card">
              <FileUp className="h-4 w-4 mr-1" /> Import
            </Button>
          </Link>
          <Link href="/routines/new">
            <Button size="sm" className="bg-primary rounded-full px-4 font-black uppercase text-[10px] tracking-widest h-9">
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </Link>
        </div>
      </header>

      <div className="space-y-4 pb-32">
        {routines.map((routine) => (
          <Card key={routine.id} className="relative overflow-hidden card-hover border-none bg-card shadow-sm border-l-4" style={{ borderLeft: `4px solid ${routine.color || 'hsl(var(--primary))'}` }}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-black text-xl mb-1 truncate text-foreground">{routine.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest" style={{ backgroundColor: `${routine.color}20`, color: routine.color }}>
                      {routine.exercises.length} Exercises
                    </span>
                    {routine.lastPerformed && (
                      <span className="text-[9px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-black uppercase tracking-widest">
                        Last: {new Date(routine.lastPerformed).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/routines/edit?id=${routine.id}`}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground h-10 w-10 bg-muted/50 rounded-full">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-10 w-10 bg-muted/50 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] bg-card border-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black">Delete Routine?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium">
                          Are you sure you want to delete "{routine.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(routine.id)} className="bg-destructive text-destructive-foreground rounded-xl font-black uppercase text-[10px] tracking-widest">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Link href={`/workout?id=${routine.id}`}>
                    <Button className="rounded-xl h-10 px-4 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20" style={{ backgroundColor: routine.color || 'hsl(var(--primary))' }}>
                      <Play className="h-3 w-3 mr-2 fill-current" /> Start
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-1.5 opacity-70">
                {routine.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Dumbbell className="h-3 w-3 text-primary/40" />
                    <span className="truncate">{ex.name}</span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <p className="text-[10px] text-muted-foreground/60 italic pl-5">And {routine.exercises.length - 3} more...</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && routines.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center border-4 border-dashed border-muted/50">
              <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-black uppercase text-xs tracking-widest">No routines found</p>
              <p className="text-muted-foreground text-[10px] font-medium max-w-[200px] mx-auto">Create a template to track your favorite workouts easily.</p>
            </div>
            <Link href="/routines/new" className="inline-block mt-4">
              <Button className="bg-primary rounded-xl font-black uppercase text-[10px] tracking-widest px-8">Get Started</Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
