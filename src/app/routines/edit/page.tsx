"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getExercises, saveRoutine, getRoutines, ROUTINE_COLORS, type Exercise } from '@/lib/store';
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function EditRoutineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(ROUTINE_COLORS[0].value);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const routines = await getRoutines();
      const found = routines.find(r => r.id === id);
      if (found) {
        setName(found.name);
        setSelectedColor(found.color || ROUTINE_COLORS[0].value);
        setSelectedExercises(found.exercises);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdate = async () => {
    if (!id || !name || selectedExercises.length === 0) return;
    await saveRoutine({ id, name, exercises: selectedExercises, color: selectedColor });
    toast({ title: "Routine updated!" });
    router.push('/routines');
  };

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/routines"><Button variant="ghost" size="icon"><ChevronLeft className="h-6 w-6" /></Button></Link>
          <h1 className="text-xl font-bold">Edit Routine</h1>
        </div>
        <Button onClick={handleUpdate} className="font-bold rounded-xl px-6">Update</Button>
      </header>

      <div className="p-5 space-y-6 pb-20">
        <Input 
          className="text-lg font-bold h-14 rounded-2xl bg-card border-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-between items-center">
           <h2 className="text-sm font-bold uppercase text-muted-foreground">Exercises ({selectedExercises.length})</h2>
        </div>
        <div className="space-y-3">
          {selectedExercises.map((ex, idx) => (
            <Card key={idx} className="border-none shadow-sm bg-card overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <span className="font-bold">{ex.name}</span>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSelectedExercises(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EditRoutinePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p className="text-muted-foreground animate-pulse">Loading routine...</p></div>}>
      <EditRoutineContent />
    </Suspense>
  );
}
