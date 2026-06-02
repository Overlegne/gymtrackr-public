"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { getAiGeneratedRoutineSuggestion, type AiGeneratedRoutineSuggestionOutput } from '@/ai/flows/ai-generated-routine-suggestion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveRoutine, getExercises } from '@/lib/store';

export function AiRoutineGenerator() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiGeneratedRoutineSuggestionOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getAiGeneratedRoutineSuggestion({
        muscleGroupFocus: ['Borst', 'Rug'],
        equipmentAvailable: ['Halter', 'Barbell', 'Machine']
      });
      setSuggestion(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fout bij genereren",
        description: "Kon geen AI-voorstel genereren. Probeer het later opnieuw."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoutine = async () => {
    if (!suggestion) return;
    
    const allExercises = await getExercises();
    
    const mappedExercises = suggestion.exercises.map((ex, i) => {
      const existing = allExercises.find(e => e.name.toLowerCase() === ex.name.toLowerCase());
      return existing || {
        id: `ai-${Date.now()}-${i}`,
        name: ex.name,
        muscleGroup: (ex.muscleGroup.charAt(0).toUpperCase() + ex.muscleGroup.slice(1)) as any,
        equipment: (ex.equipment[0] || 'Machine') as any,
        defaultSets: 3,
        defaultReps: 12,
        imageUrl: `https://picsum.photos/seed/gym-${i}/600/400`,
        loggingType: 'weight_reps'
      };
    });

    await saveRoutine({
      id: `ai-${Date.now()}`,
      name: suggestion.routineName,
      exercises: mappedExercises
    });

    toast({
      title: "Routine Toegevoegd",
      description: `"${suggestion.routineName}" is toegevoegd aan je lijst.`
    });
    setSuggestion(null);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          AI Routine Voorstel
        </CardTitle>
        <CardDescription>
          Laat onze AI een routine voor je samenstellen op basis van je doelen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestion ? (
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Samenstellen...' : 'Genereer Routine'}
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="border rounded-xl p-4 bg-white/50 space-y-3">
              <h3 className="font-bold text-primary">{suggestion.routineName}</h3>
              <ul className="space-y-2">
                {suggestion.exercises.map((ex, i) => (
                  <li key={i} className="text-sm flex justify-between items-center border-b border-dashed pb-1 last:border-0">
                    <span className="font-medium">{ex.name}</span>
                    <Badge variant="secondary" className="text-[10px] h-5">{ex.muscleGroup}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRoutine} className="flex-1 bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" /> Toevoegen
              </Button>
              <Button variant="outline" onClick={() => setSuggestion(null)} className="flex-1">
                Annuleren
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
