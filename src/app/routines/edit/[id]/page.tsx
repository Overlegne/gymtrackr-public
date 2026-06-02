"use client"

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getExercises, saveRoutine, getRoutines, ROUTINE_COLORS, type Exercise, type Routine } from '@/lib/store';
import { ChevronLeft, Plus, Search, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(ROUTINE_COLORS[0].value);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const routines = getRoutines();
    const found = routines.find(r => r.id === id);
    if (found) {
      setName(found.name);
      setSelectedColor(found.color || ROUTINE_COLORS[0].value);
      setSelectedExercises(found.exercises);
    }
    setAllExercises(getExercises());
    setLoading(false);
  }, [id]);

  const handleUpdate = () => {
    if (!name) {
      toast({ variant: "destructive", title: "Name required" });
      return;
    }
    if (selectedExercises.length === 0) {
      toast({ variant: "destructive", title: "Exercises required" });
      return;
    }

    saveRoutine({
      id,
      name,
      exercises: selectedExercises,
      color: selectedColor
    });

    toast({ title: "Routine updated!" });
    router.push('/routines');
  };

  const filteredExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) &&
    !selectedExercises.find(s => s.id === ex.id)
  );

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/routines">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Edit Routine</h1>
        </div>
        <Button onClick={handleUpdate} className="bg-primary text-primary-foreground font-bold rounded-xl px-6">
          Update
        </Button>
      </header>

      <div className="p-5 space-y-6 pb-20">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Routine Name</label>
            <Input 
              placeholder="e.g. Chest & Back Focus" 
              className="text-lg font-bold h-14 rounded-2xl bg-card shadow-sm border-none px-5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Color Theme</label>
            <div className="flex flex-wrap gap-3 p-4 bg-card rounded-2xl shadow-sm border border-border">
              {ROUTINE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && <Check className="text-white h-6 w-6 stroke-[3px]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Exercises ({selectedExercises.length})</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPicker(true)}
              className="text-primary border-primary rounded-full px-4"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-3">
            {selectedExercises.map((ex) => (
              <Card key={ex.id} className="border-none shadow-sm overflow-hidden bg-card">
                <CardContent className="p-0 flex items-center">
                  <div className="relative h-16 w-20 bg-muted shrink-0">
                    <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{ex.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{ex.muscleGroup} • {ex.equipment}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setSelectedExercises(prev => prev.filter(e => e.id !== ex.id))}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-background rounded-t-[2.5rem] flex flex-col p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Exercise</h2>
              <Button variant="ghost" className="font-bold text-primary" onClick={() => setShowPicker(false)}>Done</Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-10 h-12 rounded-xl bg-muted border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-10">
              {filteredExercises.map(ex => (
                <Card 
                  key={ex.id} 
                  className="border-none shadow-sm cursor-pointer bg-card"
                  onClick={() => setSelectedExercises(prev => [...prev, ex])}
                >
                  <CardContent className="p-0 flex items-center">
                    <div className="relative h-16 w-20 bg-muted shrink-0">
                      <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{ex.name}</h3>
                        <Badge variant="secondary" className="text-[9px] uppercase">{ex.muscleGroup}</Badge>
                      </div>
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
