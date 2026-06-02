
"use client"

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getRoutines, deleteRoutine, type Routine } from '@/lib/store';
import { Plus, Dumbbell, Play, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  const handleDelete = (id: string) => {
    deleteRoutine(id);
    setRoutines(getRoutines());
  };

  return (
    <div className="p-5 space-y-6">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">My Routines</h1>
        <Link href="/routines/new">
          <Button size="sm" className="bg-primary rounded-full">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </Link>
      </header>

      <div className="space-y-4 pb-20">
        {routines.map((routine) => (
          <Card key={routine.id} className="relative overflow-hidden card-hover border-l-4" style={{ borderLeftColor: routine.color || '#8b5cf6' }}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">{routine.name}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${routine.color}20`, color: routine.color }}>
                      {routine.exercises.length} Exercises
                    </span>
                    {routine.lastPerformed && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">
                        Last: {new Date(routine.lastPerformed).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-10 w-10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Routine?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{routine.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(routine.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Link href={`/workout/${routine.id}`}>
                    <Button className="rounded-xl h-10 px-4 text-white" style={{ backgroundColor: routine.color || '#8b5cf6' }}>
                      <Play className="h-4 w-4 mr-2 fill-current" /> Start
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                {routine.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Dumbbell className="h-3 w-3" />
                    <span>{ex.name}</span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <p className="text-xs text-muted-foreground italic pl-5">And {routine.exercises.length - 3} more...</p>
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
            <p className="text-muted-foreground">You haven't created any routines yet.</p>
            <Link href="/routines/new">
              <Button className="bg-primary">Get Started</Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
