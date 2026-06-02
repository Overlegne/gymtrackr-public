
"use client"

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getLastWorkoutSummary, kgToDisplay, type WorkoutSummaryData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Timer, 
  Dumbbell, 
  CheckCircle2, 
  ChevronRight, 
  Share2, 
  TrendingUp, 
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings-store';

export default function WorkoutSummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<WorkoutSummaryData | null>(null);
  const [mounted, setMounted] = useState(false);

  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';

  useEffect(() => {
    setMounted(true);
    const data = getLastWorkoutSummary();
    if (!data) {
      router.push('/');
      return;
    }
    setSummary(data);
  }, [router]);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  if (!mounted || !summary) return null;

  const allRecords = [
    ...summary.globalRecords,
    ...summary.exercises.flatMap(ex => ex.records.map(r => `${ex.name}: ${r}`))
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Success Header */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center text-primary animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Workout Complete!</h1>
            <p className="text-muted-foreground font-medium">{summary.routineName}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{new Date(summary.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-card rounded-[2rem] ring-1 ring-border/20">
            <CardContent className="p-5 flex flex-col items-center text-center gap-1">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <span className="text-xl font-black text-foreground">{formatDuration(summary.durationSeconds)}</span>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Duration</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-[2rem] ring-1 ring-border/20">
            <CardContent className="p-5 flex flex-col items-center text-center gap-1">
              <Dumbbell className="h-5 w-5 text-primary mb-1" />
              <span className="text-xl font-black text-foreground">{kgToDisplay(summary.totalVolume, settings.unitSystem)}{unitLabel}</span>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Total Volume</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-[2rem] ring-1 ring-border/20">
            <CardContent className="p-5 flex flex-col items-center text-center gap-1">
              <Target className="h-5 w-5 text-primary mb-1" />
              <span className="text-xl font-black text-foreground">{summary.totalSets}</span>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Sets Logged</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-[2rem] ring-1 ring-border/20">
            <CardContent className="p-5 flex flex-col items-center text-center gap-1">
              <Trophy className="h-5 w-5 text-primary mb-1" />
              <span className="text-xl font-black text-foreground">{allRecords.length}</span>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Records Hit</span>
            </CardContent>
          </Card>
        </div>

        {/* Records Section */}
        {allRecords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black uppercase tracking-tight">Achievements</h2>
            </div>
            <div className="space-y-3">
              {summary.globalRecords.map((rec, i) => (
                <div key={i} className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-right duration-500 delay-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-foreground">{rec}</p>
                      <p className="text-[9px] font-black uppercase text-primary tracking-widest">New Personal Milestone</p>
                    </div>
                  </div>
                </div>
              ))}
              {summary.exercises.flatMap(ex => ex.records.map((rec, i) => (
                <div key={`${ex.id}-${i}`} className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-foreground">{rec}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{ex.name}</p>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* Muscle Split */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase text-muted-foreground tracking-[0.2em]">Muscle Distribution</h2>
          <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/30">
                {summary.muscleSplit.map((split, i) => (
                  <div 
                    key={split.muscle}
                    className="h-full transition-all"
                    style={{ 
                      width: `${split.percentage}%`, 
                      backgroundColor: `hsl(var(--primary), ${1 - (i * 0.2)})` 
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {summary.muscleSplit.map((split) => (
                  <div key={split.muscle} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{split.muscle}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{split.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase text-muted-foreground tracking-[0.2em]">Exercise Breakdown</h2>
          <div className="space-y-3">
            {summary.exercises.map((ex) => (
              <Card key={ex.id} className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-primary/60">
                      <Dumbbell className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-foreground">{ex.name}</h3>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        {ex.sets} Sets • {ex.loggingType === 'duration' ? formatDuration(ex.durationSeconds || 0) : `${kgToDisplay(ex.topWeight, settings.unitSystem)}${unitLabel} best`}
                      </p>
                    </div>
                  </div>
                  {ex.records.length > 0 && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Trophy className="h-4 w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 pt-6 pb-20">
          <Link href="/">
            <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/30">
              Done
            </Button>
          </Link>
          <Button variant="ghost" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm text-muted-foreground hover:bg-muted/30">
            <Share2 className="h-4 w-4 mr-2" /> Share Summary
          </Button>
        </div>
      </main>
    </div>
  );
}
