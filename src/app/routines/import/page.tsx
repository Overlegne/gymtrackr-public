"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { callParsingService, type ParsingResponse } from '@/lib/parsing-client';
import { 
  FileUp, 
  ChevronLeft, 
  AlertCircle, 
  Trash2, 
  Search,
  Dumbbell,
  FileText,
  Table as TableIcon,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { matchExerciseToDatabase } from '@/lib/exercise-matcher';
import { saveRoutine, getExercises, type Exercise, type LoggingType } from '@/lib/store';
import Image from 'next/image';

type ImportStep = 'upload' | 'analyzing' | 'review' | 'success';

const SUPPORTED_EXTENSIONS = [
  '.pdf', '.xlsx', '.xls', '.csv', '.docx', '.doc', '.ods', '.png', '.jpg', '.jpeg'
];

const ACCEPT_STR = SUPPORTED_EXTENSIONS.join(',');

export default function RoutineImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<ImportStep>('upload');
  const [draft, setDraft] = useState<ParsingResponse | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setAllExercises(await getExercises());
    }
    load();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      toast({ 
        variant: 'destructive', 
        title: 'Unsupported File', 
        description: `Please upload one of: ${SUPPORTED_EXTENSIONS.join(', ')}` 
      });
      return;
    }

    setLoading(true);
    setStep('analyzing');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        // Call the separate parsing service via API
        const result = await callParsingService({
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream'
        });

        // Enhance with DB matching locally
        const enhancedDays = result.days.map(day => ({
          ...day,
          exercises: day.exercises.map(ex => {
            const match = matchExerciseToDatabase(ex.displayName, allExercises);
            return {
              ...ex,
              matchedExerciseId: match.exercise?.id,
              matchedExerciseName: match.exercise?.name,
              needsReview: ex.needsReview || !match.exercise || match.confidence < 0.8
            };
          })
        }));

        setDraft({ ...result, days: enhancedDays } as any);
        setEditedTitle(result.title);
        setStep('review');
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Import Failed', 
        description: err.message || 'Could not parse the file. Please ensure you are online.' 
      });
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const updateDayName = (idx: number, name: string) => {
    if (!draft) return;
    const newDays = [...draft.days];
    newDays[idx].name = name;
    setDraft({ ...draft, days: newDays });
  };

  const updateExerciseField = (dIdx: number, eIdx: number, field: string, value: any) => {
    if (!draft) return;
    const newDays = [...draft.days];
    (newDays[dIdx].exercises[eIdx] as any)[field] = value;
    setDraft({ ...draft, days: newDays });
  };

  const removeExercise = (dIdx: number, eIdx: number) => {
    if (!draft) return;
    const newDays = [...draft.days];
    newDays[dIdx].exercises.splice(eIdx, 1);
    setDraft({ ...draft, days: newDays });
  };

  const handleFinalSave = async () => {
    if (!draft) return;
    
    setLoading(true);
    try {
      for (const day of draft.days) {
        if (day.exercises.length === 0) continue;

        const mappedExercises = day.exercises.map(ex => {
          const existing = allExercises.find(e => e.id === (ex as any).matchedExerciseId);
          
          const isDuration = ex.durationSeconds && ex.durationSeconds > 0;
          const loggingType: LoggingType = isDuration ? 'duration' : (existing?.loggingType || 'weight_reps');

          if (existing) {
            return {
              ...existing,
              defaultSets: ex.sets || existing.defaultSets,
              defaultReps: ex.reps || existing.defaultReps,
              defaultDurationSeconds: ex.durationSeconds || existing.defaultDurationSeconds,
              loggingType
            } as Exercise;
          }
          
          return {
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: ex.displayName,
            muscleGroup: 'Chest',
            equipment: 'Machine',
            defaultSets: ex.sets || 3,
            defaultReps: ex.reps || 12,
            defaultDurationSeconds: ex.durationSeconds,
            loggingType,
            imageUrl: `https://picsum.photos/seed/${ex.id}/600/400`
          } as Exercise;
        });

        await saveRoutine({
          id: `imported-${Date.now()}-${day.id}`,
          name: draft.days.length > 1 ? `${editedTitle} - ${day.name}` : editedTitle,
          exercises: mappedExercises,
          color: '#8b5cf6'
        });
      }

      setStep('success');
      toast({ title: 'Import Complete', description: `${draft.days.length} workouts added to your routines.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save routines locally.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center gap-4">
        <Link href="/routines">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/30">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-foreground">Import Routine</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Digitalize from any file</p>
        </div>
      </header>

      <main className="p-5 flex-1 pb-32">
        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <FileText className="h-7 w-7" />
              </div>
              <div className="h-16 w-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                <TableIcon className="h-7 w-7" />
              </div>
              <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                <ImageIcon className="h-7 w-7" />
              </div>
              <div className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                <FileUp className="h-7 w-7" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Upload Workout</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto">
                Upload a document, spreadsheet, or screenshot. <span className="text-primary font-bold">Online access required for parsing.</span>
              </p>
            </div>
            
            <div className="w-full max-w-sm">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept={ACCEPT_STR} 
                className="hidden" 
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full h-16 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 gap-3"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
                Select File
              </Button>
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
              <h2 className="text-2xl font-black tracking-tight">Analyzing File...</h2>
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                Sending data to secure parsing service
              </p>
            </div>
          </div>
        )}

        {step === 'review' && draft && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-end gap-4">
              <div className="flex-1 min-w-0">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Routine Title</Label>
                <Input 
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl font-black tracking-tight bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/30"
                  placeholder="Enter Routine Name..."
                />
              </div>
              <Button 
                onClick={handleFinalSave}
                disabled={loading}
                className="bg-primary text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20 shrink-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Import'}
              </Button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex gap-4">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Review Draft</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                  Verify the AI extraction. {draft.days.reduce((acc, day) => acc + day.exercises.filter((ex: any) => ex.needsReview).length, 0)} items may need checking.
                </p>
              </div>
            </div>

            {draft.days.map((day, dIdx) => (
              <div key={dIdx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                    {dIdx + 1}
                  </div>
                  <Input 
                    value={day.name}
                    onChange={(e) => updateDayName(dIdx, e.target.value)}
                    className="text-lg font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 w-full"
                  />
                  <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-border text-muted-foreground shrink-0">
                    {day.exercises.length} Exercises
                  </Badge>
                </div>

                <div className="space-y-3">
                  {day.exercises.map((ex: any, eIdx) => {
                    const isTimed = ex.durationSeconds && ex.durationSeconds > 0;
                    return (
                      <Card key={eIdx} className={`border-none shadow-sm overflow-hidden bg-card ${ex.needsReview ? 'ring-2 ring-amber-500/30' : ''}`}>
                        <CardContent className="p-0 flex items-center">
                          <div className="relative h-24 w-24 shrink-0 bg-muted">
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
                            <div className="flex justify-between items-start mb-2">
                              <Input 
                                value={ex.displayName}
                                onChange={(e) => updateExerciseField(dIdx, eIdx, 'displayName', e.target.value)}
                                className="font-black text-sm p-0 h-auto bg-transparent border-none focus-visible:ring-0 truncate pr-2"
                              />
                              <div className="flex gap-1">
                                {isTimed && <Clock className="h-3 w-3 text-primary/60" />}
                                {ex.needsReview && (
                                  <Badge variant="destructive" className="text-[8px] h-4 font-black uppercase tracking-tighter bg-amber-500 hover:bg-amber-600 border-none shrink-0">
                                    Review
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-4 items-center">
                              <div className="flex flex-col">
                                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Sets</span>
                                <input 
                                  type="number"
                                  value={ex.sets || ''}
                                  onChange={(e) => updateExerciseField(dIdx, eIdx, 'sets', parseInt(e.target.value) || 0)}
                                  className="w-10 bg-muted/30 rounded px-1 text-xs font-black focus:outline-none"
                                />
                              </div>
                              
                              {isTimed ? (
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Duration</span>
                                  <input 
                                    type="number"
                                    value={ex.durationSeconds || ''}
                                    onChange={(e) => updateExerciseField(dIdx, eIdx, 'durationSeconds', parseInt(e.target.value) || 0)}
                                    className="w-14 bg-muted/30 rounded px-1 text-xs font-black focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Reps</span>
                                  <input 
                                    type="number"
                                    value={ex.reps || ''}
                                    onChange={(e) => updateExerciseField(dIdx, eIdx, 'reps', parseInt(e.target.value) || 0)}
                                    className="w-10 bg-muted/30 rounded px-1 text-xs font-black focus:outline-none"
                                  />
                                </div>
                              )}

                              {ex.matchedExerciseName && (
                                <div className="flex flex-col ml-auto">
                                  <span className="text-[8px] text-primary uppercase font-black tracking-widest text-right">Match</span>
                                  <span className="text-[10px] font-bold text-foreground truncate max-w-[100px] text-right">{ex.matchedExerciseName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-2 flex flex-col gap-1 border-l border-border/40">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-destructive/60 hover:bg-destructive/10"
                              onClick={() => removeExercise(dIdx, eIdx)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-6 text-center animate-in zoom-in-95 duration-500">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Import Successful</h2>
            <p className="text-muted-foreground font-medium max-w-[280px]">
              Your routines have been saved to your local device database.
            </p>
            <Button asChild className="w-full max-w-sm h-16 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20">
              <Link href="/routines">Go to Routines</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
