"use client"

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { parseWorkoutPdf, type ParseWorkoutPdfOutput } from '@/ai/flows/parse-workout-pdf';
import { 
  FileUp, 
  Loader2, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit2, 
  Plus, 
  Search,
  Check,
  Save,
  Dumbbell
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { matchExerciseToDatabase } from '@/lib/exercise-matcher';
import { saveRoutine, getExercises, type Exercise } from '@/lib/store';
import Image from 'next/image';

type ImportStep = 'upload' | 'analyzing' | 'review';

export default function RoutineImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<ImportStep>('upload');
  const [draft, setDraft] = useState<ParseWorkoutPdfOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a PDF document.' });
      return;
    }

    setLoading(true);
    setStep('analyzing');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await parseWorkoutPdf({
          pdfBase64: base64,
          fileName: file.name
        });

        // Enhance with DB matching
        const enhancedDays = result.days.map(day => ({
          ...day,
          exercises: day.exercises.map(ex => {
            const match = matchExerciseToDatabase(ex.displayName);
            return {
              ...ex,
              matchedExerciseId: match.exercise?.id,
              matchedExerciseName: match.exercise?.name,
              confidence: Math.min(ex.confidence, match.confidence || 0.5),
              needsReview: ex.needsReview || !match.exercise
            };
          })
        }));

        setDraft({ ...result, days: enhancedDays });
        setStep('review');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Import Failed', description: 'Could not parse the PDF. Please try again.' });
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = () => {
    if (!draft) return;

    // Convert draft days into individual routines
    // Since our app supports single routines, we'll ask the user or just save them as separate routines if multi-day
    // For MVP, we'll save it as one routine with all exercises, or if multiple days, we'll save each day as a routine.
    
    draft.days.forEach((day, index) => {
      const allExercises = getExercises();
      const mappedExercises = day.exercises.map(ex => {
        const existing = allExercises.find(e => e.id === ex.matchedExerciseId);
        if (existing) return existing;
        
        // Create a temporary exercise if not found? 
        // For simplicity, we fallback to a generic one or create it.
        return {
          id: `imported-${Date.now()}-${ex.id}`,
          name: ex.displayName,
          muscleGroup: 'Chest', // Placeholder
          equipment: 'Machine', // Placeholder
          defaultSets: ex.sets || 3,
          defaultReps: ex.reps || 12,
          imageUrl: `https://picsum.photos/seed/${ex.id}/600/400`
        } as Exercise;
      });

      saveRoutine({
        id: `imported-${Date.now()}-${index}`,
        name: draft.days.length > 1 ? `${draft.title} - ${day.name}` : draft.title,
        exercises: mappedExercises,
        color: '#8b5cf6'
      });
    });

    toast({ title: 'Import Complete', description: `${draft.days.length} workouts added to your routines.` });
    router.push('/routines');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-4 flex items-center gap-4">
        <Link href="/routines">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/30">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-foreground">PDF Import</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Digitalize your PDF plan</p>
        </div>
      </header>

      <main className="p-5 flex-1 pb-32">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-8 animate-in fade-in duration-500">
            <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <FileUp className="h-10 w-10" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Upload Routine</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto">
                Upload a PDF schedule from your trainer or a fitness program to import it instantly.
              </p>
            </div>
            
            <div className="w-full max-w-sm">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".pdf" 
                className="hidden" 
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-16 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 gap-3"
              >
                <FileUp className="h-5 w-5" />
                Select PDF File
              </Button>
              <p className="text-[9px] text-center mt-4 text-muted-foreground uppercase font-black tracking-[0.2em]">MAX 10MB • PDF FORMAT ONLY</p>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Dumbbell className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Analyzing PDF...</h2>
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Extracting exercises and workout days
              </p>
            </div>
            <Card className="w-full max-w-sm bg-muted/30 border-none rounded-3xl p-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <CheckCircle2 className="h-4 w-4" /> Reading text layers
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground animate-pulse">
                  <div className="h-4 w-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" /> Identifying tables
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Matching exercises
                </li>
              </ul>
            </Card>
          </div>
        )}

        {step === 'review' && draft && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{draft.title}</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Imported Draft Routine</p>
              </div>
              <Button 
                onClick={handleFinalSave}
                className="bg-primary text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                Save All
              </Button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex gap-4">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Review Required</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                  We found {draft.days.reduce((acc, day) => acc + day.exercises.filter(ex => ex.needsReview).length, 0)} items that might need correction. Please verify the sets and exercise matches.
                </p>
              </div>
            </div>

            {draft.days.map((day, dIdx) => (
              <div key={dIdx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {dIdx + 1}
                  </div>
                  <h3 className="text-lg font-black">{day.name}</h3>
                  <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-border text-muted-foreground">
                    {day.exercises.length} Exercises
                  </Badge>
                </div>

                <div className="space-y-3">
                  {day.exercises.map((ex, eIdx) => (
                    <Card key={ex.id} className={`border-none shadow-sm overflow-hidden bg-card ${ex.needsReview ? 'ring-2 ring-amber-500/30' : ''}`}>
                      <CardContent className="p-0 flex items-center">
                        <div className="relative h-20 w-24 shrink-0 bg-muted">
                           {ex.matchedExerciseId ? (
                             <Image 
                               src={`https://picsum.photos/seed/${ex.matchedExerciseId}/200/200`}
                               alt={ex.displayName}
                               fill
                               className="object-cover"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                               <Search className="h-8 w-8" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-sm truncate pr-2">{ex.displayName}</h4>
                            {ex.needsReview && (
                              <Badge variant="destructive" className="text-[8px] h-4 font-black uppercase tracking-tighter bg-amber-500 hover:bg-amber-600 border-none shrink-0">
                                Review
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-3 items-center">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Sets</span>
                              <span className="text-xs font-black">{ex.sets || '—'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Reps</span>
                              <span className="text-xs font-black">{ex.reps || '—'}</span>
                            </div>
                            {ex.matchedExerciseName && (
                              <div className="flex flex-col ml-auto">
                                <span className="text-[8px] text-primary uppercase font-black tracking-widest text-right">Match</span>
                                <span className="text-[10px] font-bold text-foreground truncate max-w-[100px] text-right">{ex.matchedExerciseName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-2 flex flex-col gap-1 border-l border-border/40">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive/60 hover:bg-destructive/10">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-border bg-transparent text-muted-foreground font-bold text-xs gap-2">
                    <Plus className="h-4 w-4" /> Add Exercise to {day.name}
                  </Button>
                </div>
              </div>
            ))}

            {draft.unmatchedItems.length > 0 && (
              <Card className="bg-muted/10 border-none rounded-3xl p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unmatched Snippets</h4>
                <div className="flex flex-wrap gap-2">
                  {draft.unmatchedItems.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-muted text-[10px] font-medium py-1 px-3 rounded-lg">
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            <div className="pt-10 pb-20">
              <Button 
                onClick={handleFinalSave}
                className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/30"
              >
                Complete Import
              </Button>
              <p className="text-center mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Check all items before finishing
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
