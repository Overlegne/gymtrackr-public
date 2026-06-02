
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getExercises, saveRoutine, getExerciseStats, kgToDisplay, ROUTINE_COLORS, type Exercise } from '@/lib/store';
import { ChevronLeft, Plus, Search, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getSettings } from '@/lib/settings-store';

export default function NewRoutinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(ROUTINE_COLORS[0].value);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';

  useEffect(() => {
    setAllExercises(getExercises());
  }, []);

  const handleSave = () => {
    if (!name) {
      toast({ variant: "destructive", title: "Name required", description: "Please give your routine a name." });
      return;
    }
    if (selectedExercises.length === 0) {
      toast({ variant: "destructive", title: "Exercises required", description: "Add at least one exercise." });
      return;
    }

    saveRoutine({
      id: Date.now().toString(),
      name,
      exercises: selectedExercises,
      color: selectedColor
    });

    toast({ title: "Routine saved!", description: `"${name}" is now available.` });
    router.push('/routines');
  };

  const filteredExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) &&
    !selectedExercises.find(s => s.id === ex.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/routines">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">New Routine</h1>
        </div>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground font-bold rounded-xl px-6">
          Save
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
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Choose a color</label>
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
            {selectedExercises.map((ex) => {
              const stats = getExerciseStats(ex.id);
              const lastSet = stats.sets[0] || null;
              return (
                <Card key={ex.id} className="border-none shadow-sm card-hover overflow-hidden bg-card">
                  <CardContent className="p-0 flex items-center">
                    <div className="relative h-16 w-20 bg-muted shrink-0">
                      <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" data-ai-hint="gym exercise" />
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{ex.name}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {ex.defaultSets} sets • {lastSet?.reps || ex.defaultReps} reps {lastSet?.weight ? `• ${kgToDisplay(lastSet.weight, settings.unitSystem)}${unitLabel}` : ''}
                        </p>
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
              );
            })}

            {selectedExercises.length === 0 && (
              <div 
                onClick={() => setShowPicker(true)}
                className="py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-primary/5 transition-colors border-border"
              >
                <Plus className="h-8 w-8 mb-2 opacity-50" />
                <p className="font-medium">Click to choose exercises</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-background rounded-t-[2.5rem] flex flex-col p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Choose Exercise</h2>
              <Button variant="ghost" className="font-bold text-primary" onClick={() => setShowPicker(false)}>Done</Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-10 h-12 rounded-xl bg-muted border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-10">
              {filteredExercises.map(ex => (
                <Card 
                  key={ex.id} 
                  className="border-none shadow-sm active:bg-primary/5 cursor-pointer overflow-hidden bg-card"
                  onClick={() => {
                    setSelectedExercises(prev => [...prev, ex]);
                  }}
                >
                  <CardContent className="p-0 flex items-center">
                    <div className="relative h-16 w-20 bg-muted shrink-0">
                      <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" data-ai-hint="gym exercise" />
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{ex.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">{ex.muscleGroup}</Badge>
                          <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{ex.equipment}</Badge>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                        <Plus className="h-5 w-5" />
                      </div>
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
