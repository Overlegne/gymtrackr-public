
"use client"

import React from 'react';
import Image from 'next/image';
import { Exercise, type SetStats } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Target, 
  Info, 
  AlertTriangle, 
  RefreshCcw, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ExerciseDetailCardProps {
  exercise: Exercise;
  lastPerformance?: SetStats[];
}

export function ExerciseDetailCard({ exercise, lastPerformance }: ExerciseDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Image Header */}
      <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner group">
        <Image 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="gym exercise movement"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        {exercise.imageNeedsReview && (
          <Badge variant="secondary" className="absolute top-4 left-4 bg-amber-500 text-white border-none text-[10px] font-black uppercase tracking-widest">
            <Info className="h-3 w-3 mr-1" /> Category Visual
          </Badge>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
            <Target className="h-3 w-3 mr-1" /> {exercise.muscleGroup}
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-500">
            <Dumbbell className="h-3 w-3 mr-1" /> {exercise.equipment}
          </Badge>
          {exercise.secondaryMuscles?.map((m) => (
            <Badge key={m} variant="outline" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-slate-100 bg-slate-50 text-slate-400">
              {m}
            </Badge>
          ))}
        </div>
      </div>

      {/* Form Cues Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Form Cues</h4>
        </div>
        <div className="grid gap-2">
          {exercise.cues?.map((cue, i) => (
            <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
              <span className="text-xs font-black text-primary/40 mt-0.5">0{i + 1}</span>
              <p className="text-sm font-medium text-slate-600 leading-snug">{cue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mistakes Warning (Optional) */}
      {exercise.mistakes && exercise.mistakes.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-[1.5rem] p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Common Mistakes</h4>
          </div>
          <ul className="space-y-1.5">
            {exercise.mistakes.map((mistake, i) => (
              <li key={i} className="text-xs font-medium text-amber-700/80 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-400" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternatives Section */}
      {exercise.alternatives && exercise.alternatives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <RefreshCcw className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Equipment Busy?</h4>
          </div>
          <div className="space-y-2">
            {exercise.alternatives.map((alt) => (
              <Card key={alt.id} className="border-none shadow-sm bg-slate-50/50 rounded-2xl overflow-hidden transition-all active:scale-[0.98]">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{alt.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Matches pattern</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Last Performance History */}
      {lastPerformance && lastPerformance.length > 0 && (
        <div className="pt-4">
          <Separator className="mb-6 opacity-50" />
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Performance</h4>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-[9px] font-black">PREVIOUS SESSION</Badge>
            </div>
            <div className="space-y-3">
              {lastPerformance.map((set, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Set {i + 1}</span>
                  <div className="flex gap-4">
                    <span className="text-sm font-black">{set.weight} <span className="text-[10px] text-slate-500 font-bold">KG</span></span>
                    <span className="text-sm font-black">{set.reps} <span className="text-[10px] text-slate-500 font-bold">REPS</span></span>
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
