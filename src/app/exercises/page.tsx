"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getExercises, getExerciseStats, updateExercise, type Exercise, type MuscleGroup, type Equipment } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, Edit, Upload, Link as LinkIcon, Check, TrendingUp, Settings2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  
  // UI Modes
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  
  // Detail Editing state
  const [editName, setEditName] = useState('');
  const [editMuscle, setEditMuscle] = useState<MuscleGroup>('Chest');
  const [editEquipment, setEditEquipment] = useState<Equipment>('Barbell');
  const [editCues, setEditCues] = useState('');

  // Image editing state
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
    
    setExercises(getExercises());
    setSelectedExercise(updatedEx);
    setIsEditingImage(false);
    setTempImageUrl('');
    
    toast({
      title: "Image updated",
      description: `New picture saved for ${selectedExercise.name}.`
    });
  };

  const handleUpdateDetails = () => {
    if (!selectedExercise) return;

    const updatedEx: Exercise = {
      ...selectedExercise,
      name: editName,
      muscleGroup: editMuscle,
      equipment: editEquipment,
      cues: editCues.split('\n').filter(c => c.trim() !== '')
    };

    updateExercise(updatedEx);
    setExercises(getExercises());
    setSelectedExercise(updatedEx);
    setIsEditingDetails(false);

    toast({
      title: "Details updated",
      description: `Coaching cues and exercise metadata saved.`
    });
  };

  const openDetailsEditor = () => {
    if (!selectedExercise) return;
    setEditName(selectedExercise.name);
    setEditMuscle(selectedExercise.muscleGroup);
    setEditEquipment(selectedExercise.equipment);
    setEditCues(selectedExercise.cues?.join('\n') || '');
    setIsEditingDetails(true);
    setIsEditingImage(false);
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
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-5 space-y-6 pb-24 pt-[calc(1rem+var(--safe-top))]">
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
            className="pl-10 rounded-2xl h-12 border-none bg-card shadow-sm font-medium"
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
                selectedMuscle === muscle ? 'bg-primary text-white shadow-md' : 'bg-card border-border text-muted-foreground hover:bg-muted'
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
              className="card-hover overflow-hidden cursor-pointer border-none shadow-sm bg-card rounded-3xl group"
              onClick={() => {
                setSelectedExercise(ex);
                setIsEditingImage(false);
                setIsEditingDetails(false);
              }}
            >
              <CardContent className="p-0 flex items-center">
                <div className="relative h-20 w-24 shrink-0 bg-muted">
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
                    <h3 className="font-black text-sm text-foreground truncate">{ex.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] text-primary uppercase font-black tracking-widest">{ex.muscleGroup}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">•</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{ex.equipment}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[92vh] overflow-y-auto border-none p-0 bg-card">
          {selectedExercise && (
            <div className="flex flex-col">
              <div className="p-6 pb-0">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-black leading-tight text-foreground">{selectedExercise.name}</DialogTitle>
                      <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Movement Details</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-muted h-10 w-10 shrink-0"
                        onClick={openDetailsEditor}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-muted h-10 w-10 shrink-0"
                        onClick={() => {
                          setIsEditingImage(!isEditingImage);
                          setIsEditingDetails(false);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                {isEditingImage && (
                  <div className="mb-6 bg-muted/30 p-5 rounded-3xl border border-dashed border-border space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Update Illustration</h4>
                      <div className="flex bg-card rounded-xl p-1 shadow-sm border">
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
                        className="rounded-xl h-12 bg-card border-none shadow-sm text-sm"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload}/>
                        <Button variant="outline" className="w-full rounded-xl h-12 border-dashed border-border bg-card" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" /> Choose Image File
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl font-black h-11" onClick={handleUpdateImage} disabled={!tempImageUrl}>Save</Button>
                      <Button variant="ghost" className="flex-1 rounded-xl font-black h-11" onClick={() => setIsEditingImage(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {isEditingDetails && (
                  <div className="mb-6 bg-muted/30 p-5 rounded-3xl border border-border space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</Label>
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-card rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Muscle</Label>
                          <Select value={editMuscle} onValueChange={v => setEditMuscle(v as MuscleGroup)}>
                            <SelectTrigger className="bg-card rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'].map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Equipment</Label>
                          <Select value={editEquipment} onValueChange={v => setEditEquipment(v as Equipment)}>
                            <SelectTrigger className="bg-card rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['Dumbbell', 'Barbell', 'Machine', 'Cable', 'Bodyweight'].map(e => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Form Cues (One per line)</Label>
                        <Textarea 
                          value={editCues} 
                          onChange={e => setEditCues(e.target.value)} 
                          className="bg-card rounded-xl min-h-[100px] text-sm"
                          placeholder="Drive through heels..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl font-black h-11" onClick={handleUpdateDetails}>Save Details</Button>
                      <Button variant="ghost" className="flex-1 rounded-xl font-black h-11" onClick={() => setIsEditingDetails(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="pb-6">
                  <Link href={`/exercises/${selectedExercise.id}/progress`} className="block">
                    <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest gap-2 bg-foreground text-background shadow-xl hover:opacity-90 transition-all active:scale-95 mb-6">
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
