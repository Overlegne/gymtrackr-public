
"use client"

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Exercise, kgToDisplay, getProgressionSuggestion, type SetStats } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Target, 
  Info, 
  AlertTriangle, 
  RefreshCcw, 
  ChevronRight,
  ClipboardList,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getSettings } from '@/lib/settings-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExerciseDetailCardProps {
  exercise: Exercise;
  lastPerformance?: SetStats[];
}

export function ExerciseDetailCard({ exercise, lastPerformance }: ExerciseDetailCardProps) {
  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'KG' : 'LB';
  const suggestion = useMemo(() => getProgressionSuggestion(exercise.id), [exercise.id]);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-muted shadow-inner group border border-border/20">
        <Image 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="gym exercise movement"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        {exercise.imageNeedsReview && (
          <Badge variant="secondary" className="absolute top-4 left-4 bg-amber-500 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
            <Info className="h-3 w-3 mr-1" /> Category Visual
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
            <Target className="h-3 w-3 mr-1.5" /> {exercise.muscleGroup}
          </Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-border text-muted-foreground">
            <Dumbbell className="h-3 w-3 mr-1.5" /> {exercise.equipment}
          </Badge>
          {exercise.secondaryMuscles?.map((m) => (
            <Badge key={m} variant="outline" className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-border/30 bg-muted/20 text-muted-foreground/60">
              {m}
            </Badge>
          ))}
        </div>
      </div>

      {suggestion && (
        <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-primary/5 ring-1 ring-primary/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">Next Session Goal</h4>
                  <p className="text-[10px] text-primary uppercase font-black tracking-widest">Smart Progression</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-primary/10">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-[10px] font-bold leading-relaxed">
                    {suggestion.reason}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Target</p>
                <p className="text-xl font-black text-foreground">
                   {suggestion.type === 'increase_duration' ? (
                    `${suggestion.suggestedDuration}s Hold`
                  ) : (
                    `${suggestion.suggestedWeight ? kgToDisplay(suggestion.suggestedWeight, settings.unitSystem) + unitLabel : ''} ${suggestion.suggestedWeight && suggestion.suggestedReps ? 'x' : ''} ${suggestion.suggestedReps ? suggestion.suggestedReps + ' Reps' : ''}`
                  )}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Form Cues</h4>
        </div>
        <div className="grid gap-2.5">
          {exercise.cues?.map((cue, i) => (
            <div key={i} className="flex items-start gap-4 bg-card p-4 rounded-2xl border border-border/40 shadow-sm transition-all hover:border-primary/30 group">
              <span className="text-[10px] font-black text-primary/30 mt-1 transition-colors group-hover:text-primary">0{i + 1}</span>
              <p className="text-sm font-semibold text-muted-foreground leading-snug group-hover:text-foreground transition-colors">{cue}</p>
            </div>
          ))}
        </div>
      </div>

      {exercise.mistakes && exercise.mistakes.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-[2rem] p-5 space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Common Mistakes</h4>
          </div>
          <ul className="space-y-2">
            {exercise.mistakes.map((mistake, i) => (
              <li key={i} className="text-xs font-semibold text-muted-foreground flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {exercise.alternatives && exercise.alternatives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <RefreshCcw className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Equipment Busy?</h4>
          </div>
          <div className="space-y-2.5">
            {exercise.alternatives.map((alt) => (
              <Card key={alt.id} className="border-none shadow-sm bg-muted/20 rounded-[1.5rem] overflow-hidden transition-all active:scale-[0.98] border border-border/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-primary/40">
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">{alt.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Target pattern match</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {lastPerformance && lastPerformance.length > 0 && (
        <div className="pt-4">
          <Separator className="mb-8 opacity-30" />
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-6 text-white shadow-2xl ring-1 ring-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Performance</h4>
              <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px] font-black tracking-widest">PREVIOUS SESSION</Badge>
            </div>
            <div className="space-y-3">
              {lastPerformance.map((set, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Set {i + 1}</span>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black">{kgToDisplay(set.weight, settings.unitSystem)}</span>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{unitLabel}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black">{set.reps}</span>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">REPS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
