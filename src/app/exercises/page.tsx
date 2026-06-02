
"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getExercises, getExerciseStats, updateExercise, type Exercise, type MuscleGroup } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, Edit, Upload, Link as LinkIcon, Check, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ExerciseDetailCard } from '@/components/ExerciseDetailCard';
import Image from 'next/image';
import Link from 'next/link';

export default function ExercisesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Image editing state
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleExerciseAdded = () => {
    setExercises(getExercises());
  };

  const lastPerformance = useMemo(() => {
    if (!selectedExercise) return [];
    const stats = getExerciseStats(selectedExercise.id);
    if (!stats.sets) return [];
    
    return Object.entries(stats.sets)
      .map(([idx, values]) => ({
        index: parseInt(idx),
        weight: values.weight,
        reps: values.reps
      }))
      .sort((a, b) => a.index - b.index);
  }, [selectedExercise]);

  const handleUpdateImage = () => {
    if (!selectedExercise || !tempImageUrl) return;
    
    const updatedEx = { ...selectedExercise, imageUrl: tempImageUrl };
    updateExercise(updatedEx);
    
    // Refresh local lists
    setExercises(getExercises());
    setSelectedExercise(updatedEx);
    setIsEditingImage(false);
    setTempImageUrl('');
    
    toast({
      title: "Image updated",
      description: `New picture saved for ${selectedExercise.name}.`
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <div className="p-5 space-y-6 pb-24">
        <header className="py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Library</h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Master your movements</p>
          </div>
          <AddExerciseDialog onExerciseAdded={handleExerciseAdded} />
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            className="pl-10 rounded-2xl h-12 border-none bg-white shadow-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {muscleGroups.map(muscle => (
            <Badge 
              key={muscle}
              variant={selectedMuscle === muscle ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedMuscle === muscle ? 'bg-primary text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setSelectedMuscle(muscle)}
            >
              {muscle}
            </Badge>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(ex => (
            <Card 
              key={ex.id} 
              className="card-hover overflow-hidden cursor-pointer border-none shadow-sm bg-white rounded-3xl group"
              onClick={() => {
                setSelectedExercise(ex);
                setIsEditingImage(false);
              }}
            >
              <CardContent className="p-0 flex items-center">
                <div className="relative h-20 w-24 shrink-0 bg-slate-100">
                  <Image 
                    src={ex.imageUrl} 
                    alt={ex.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint="gym exercise icon"
                  />
                </div>
                <div className="flex-1 p-4 flex items-center justify-between overflow-hidden">
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-slate-800 truncate">{ex.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] text-primary uppercase font-black tracking-widest">{ex.muscleGroup}</span>
                      <span className="text-[9px] text-slate-300 uppercase font-black tracking-widest">•</span>
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{ex.equipment}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-inner border border-dashed">
              <p className="text-muted-foreground font-bold italic">No exercises found.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[92vh] overflow-y-auto border-none p-0 bg-white">
          {selectedExercise && (
            <div className="flex flex-col">
              <div className="p-6 pb-0">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-black leading-tight text-slate-900">{selectedExercise.name}</DialogTitle>
                      <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Exercise Blueprints</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full bg-slate-50 h-10 w-10 shrink-0"
                      onClick={() => setIsEditingImage(!isEditingImage)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>

                {isEditingImage && (
                  <div className="mb-6 bg-slate-50 p-5 rounded-3xl border border-dashed border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Illustration</h4>
                      <div className="flex bg-white rounded-xl p-1 shadow-sm border">
                        <Button 
                          variant={imageInputMode === 'url' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          className="h-8 px-4 text-[9px] font-black uppercase tracking-widest"
                          onClick={() => setImageInputMode('url')}
                        >
                          <LinkIcon className="h-3 w-3 mr-1" /> URL
                        </Button>
                        <Button 
                          variant={imageInputMode === 'upload' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          className="h-8 px-4 text-[9px] font-black uppercase tracking-widest"
                          onClick={() => setImageInputMode('upload')}
                        >
                          <Upload className="h-3 w-3 mr-1" /> Upload
                        </Button>
                      </div>
                    </div>

                    {imageInputMode === 'url' ? (
                      <Input 
                        placeholder="Paste image URL here..."
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        className="rounded-xl h-12 bg-white border-none shadow-sm text-sm"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <Button 
                          variant="outline" 
                          className="w-full rounded-xl h-12 border-dashed border-slate-300 bg-white"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" /> Choose Image File
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-11" 
                        onClick={handleUpdateImage}
                        disabled={!tempImageUrl || tempImageUrl === selectedExercise.imageUrl}
                      >
                        <Check className="h-4 w-4 mr-2" /> Save Image
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-11" 
                        onClick={() => {
                          setIsEditingImage(false);
                          setTempImageUrl('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pb-6">
                  <Link href={`/exercises/${selectedExercise.id}/progress`} className="block">
                    <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest gap-2 bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all active:scale-95 mb-6">
                      <TrendingUp className="h-5 w-5" />
                      Visual Progress
                    </Button>
                  </Link>
                  
                  <ExerciseDetailCard 
                    exercise={selectedExercise} 
                    lastPerformance={lastPerformance as any} 
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
