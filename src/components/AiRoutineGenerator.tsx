"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveRoutine, getExercises } from '@/lib/store';
import type { AiGeneratedRoutineSuggestionOutput } from '@/ai/flows/ai-generated-routine-suggestion';
import { Capacitor } from '@capacitor/core';

export function AiRoutineGenerator() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiGeneratedRoutineSuggestionOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    
    // In a static Capacitor bundle, we must point to a deployed API URL
    const BASE_URL = process.env.NEXT_PUBLIC_PARSING_SERVICE_URL || '';
    if (Capacitor.isNativePlatform() && !BASE_URL) {
      toast({
        variant: "destructive",
        title: "Configuration Missing",
        description: "AI service URL not configured."
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/suggest-routine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muscleGroupFocus: ['Chest', 'Back'],
          equipmentAvailable: ['Dumbbell', 'Barbell', 'Machine']
        })
      });

      if (!response.ok) throw new Error('Failed to generate suggestion');
      
      const result = await response.json();
      setSuggestion(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating",
        description: "Could not generate AI suggestion. Please check your connection."
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
      title: "Routine Added",
      description: `"${suggestion.routineName}" saved to your routines.`
    });
    setSuggestion(null);
  };

  return (
    <Card className="border-primary/20 bg-primary/5 rounded-[2rem] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          AI Routine Suggestion
        </CardTitle>
        <CardDescription className="text-xs font-medium">
          Let AI build a custom routine based on your goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestion ? (
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl h-12 font-black uppercase tracking-widest text-[10px]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Synthesizing...' : 'Generate New Routine'}
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="border rounded-2xl p-4 bg-card/50 space-y-3">
              <h3 className="font-black text-primary text-sm">{suggestion.routineName}</h3>
              <ul className="space-y-2">
                {suggestion.exercises.map((ex, i) => (
                  <li key={i} className="text-[11px] flex justify-between items-center border-b border-dashed border-border/50 pb-1.5 last:border-0">
                    <span className="font-bold text-foreground">{ex.name}</span>
                    <Badge variant="secondary" className="text-[8px] h-5 font-black uppercase tracking-tighter">{ex.muscleGroup}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRoutine} className="flex-1 bg-foreground text-background hover:opacity-90 rounded-xl font-black uppercase text-[10px] tracking-widest">
                <Plus className="h-4 w-4 mr-2" /> Save to My List
              </Button>
              <Button variant="ghost" onClick={() => setSuggestion(null)} className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest">
                Discard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
