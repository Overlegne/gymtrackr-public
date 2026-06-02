"use client"

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getExercises, 
  getExerciseHistory, 
  kgToDisplay, 
  detectPlateau,
  type HistoryPoint, 
  type Exercise,
  type PlateauAnalysis
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, TrendingUp, Calendar, Info, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSettings } from '@/lib/settings-store';
import { cn } from '@/lib/utils';

type TimeRange = '30d' | '90d' | '1y' | 'all';

export default function ExerciseProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [isMounted, setIsMounted] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [plateau, setPlateau] = useState<PlateauAnalysis | null>(null);

  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';

  useEffect(() => {
    setIsMounted(true);
    const foundExercise = getExercises().find(e => e.id === id);
    if (foundExercise) {
      setExercise(foundExercise);
    }
    const exerciseHistory = getExerciseHistory(id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setHistory(exerciseHistory);
    setPlateau(detectPlateau(id));
  }, [id]);

  const filteredHistory = useMemo(() => {
    if (!isMounted || history.length === 0) return [];
    let baseHistory = history;
    if (timeRange !== 'all') {
      const now = new Date();
      const rangeMs = {
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000,
      }[timeRange];
      baseHistory = history.filter(p => (now.getTime() - new Date(p.date).getTime()) <= rangeMs);
    }
    
    // Map units
    return baseHistory.map(p => ({
      ...p,
      weight: kgToDisplay(p.weight, settings.unitSystem),
      volume: kgToDisplay(p.volume, settings.unitSystem),
      e1RM: kgToDisplay(p.e1RM, settings.unitSystem),
    }));
  }, [history, timeRange, isMounted, settings]);

  const stats = useMemo(() => {
    if (!isMounted || filteredHistory.length === 0) return null;
    
    const weights = filteredHistory.map(p => p.weight);
    const reps = filteredHistory.map(p => p.reps);
    const volumes = filteredHistory.map(p => p.volume);
    const e1rms = filteredHistory.map(p => p.e1RM).filter(v => v > 0);

    const firstPoint = filteredHistory[0];
    const lastPoint = filteredHistory[filteredHistory.length - 1];
    const weightDiff = lastPoint.weight - firstPoint.weight;

    return {
      bestWeight: Math.max(...weights),
      bestReps: Math.max(...reps),
      maxVolume: Math.max(...volumes),
      bestE1RM: e1rms.length > 0 ? Math.max(...e1rms) : 0,
      weightTrend: Math.round(weightDiff * 10) / 10
    };
  }, [filteredHistory, isMounted]);

  if (!isMounted || !exercise) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center gap-4">
          <Link href="/exercises">
            <Button variant="ghost" size="icon" className="rounded-full bg-muted/30">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black truncate text-foreground">Loading...</h1>
          </div>
        </header>
      </div>
    );
  }

  const chartData = filteredHistory.map(p => ({
    ...p,
    formattedDate: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const renderChart = (dataKey: keyof HistoryPoint, label: string, unit: string) => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <TrendingUp className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground font-bold text-sm max-w-[200px] uppercase tracking-widest">
            Log this exercise a few times to see your progress.
          </p>
        </div>
      );
    }

    return (
      <div className="h-[260px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
              domain={['auto', 'auto']}
              width={35}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border/60 rounded-2xl shadow-xl p-4 text-xs space-y-2 ring-1 ring-black/5">
                      <p className="font-black text-muted-foreground uppercase tracking-widest text-[9px] border-b pb-1 mb-1">{new Date(data.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-primary text-base">{payload[0].value}</span>
                        <span className="font-black text-muted-foreground text-[10px] uppercase">{unit}</span>
                      </div>
                      {data.sets && <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest bg-muted/30 px-2 py-0.5 rounded-full inline-block">{data.sets} Sets logged</p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorMetric)"
              dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              activeDot={{ r: 6, strokeWidth: 3, stroke: 'hsl(var(--card))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 pt-[calc(1rem+var(--safe-top))] pb-4 flex items-center gap-4">
        <Link href="/exercises">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/30">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black truncate text-foreground">{exercise.name}</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Progress Analytics ({unitLabel})</p>
        </div>
      </header>

      <main className="p-5 space-y-6 pb-24">
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Best Weight</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{stats.bestWeight}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{unitLabel}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Best e1RM</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{Math.round(stats.bestE1RM)}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{unitLabel}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Max Volume</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{Math.round(stats.maxVolume)}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{unitLabel}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/20">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Best Reps</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{stats.bestReps}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">reps</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plateau Detection Section */}
        {plateau && (
          <Card className={cn(
            "border-none shadow-lg rounded-[2rem] overflow-hidden ring-1 transition-all duration-500",
            plateau.status === 'Plateau' ? "bg-amber-500/5 ring-amber-500/20" : "bg-primary/5 ring-primary/10"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {plateau.status === 'Plateau' ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-lg font-black text-foreground">Progress Analysis</CardTitle>
                </div>
                <Badge variant={plateau.status === 'Plateau' ? 'destructive' : 'default'} className={cn(
                  "rounded-full text-[9px] font-black uppercase tracking-widest px-3",
                  plateau.status === 'Plateau' ? "bg-amber-500" : "bg-primary"
                )}>
                  {plateau.status === 'Plateau' ? 'Plateau Detected' : 'Progressing'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed italic">
                {plateau.reason}
              </p>
              
              {plateau.suggestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    How to Break Through:
                  </div>
                  <div className="grid gap-2">
                    {plateau.suggestions.map((tip, i) => (
                      <div key={i} className="bg-card p-3 rounded-2xl border border-border/50 text-[11px] font-bold text-muted-foreground flex gap-3 items-start group hover:border-amber-500/30 transition-colors">
                        <span className="text-amber-500 font-black">0{i+1}</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex justify-center bg-card p-1.5 rounded-[1.5rem] shadow-sm ring-1 ring-border/30">
            {(['30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  timeRange === range 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Card className="border-none shadow-xl shadow-black/5 bg-card rounded-[2.5rem] overflow-hidden ring-1 ring-border/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-black text-foreground">Performance Chart</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metrics over time ({unitLabel})</CardDescription>
                </div>
                {stats && stats.weightTrend !== 0 && (
                  <Badge variant={stats.weightTrend > 0 ? 'default' : 'destructive'} className="rounded-full h-7 px-4 font-black uppercase tracking-widest text-[9px]">
                    {stats.weightTrend > 0 ? '+' : ''}{stats.weightTrend}{unitLabel} Trend
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weight" className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-11 rounded-2xl bg-muted/30 p-1">
                  <TabsTrigger value="weight" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">Weight</TabsTrigger>
                  <TabsTrigger value="reps" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">Reps</TabsTrigger>
                  <TabsTrigger value="volume" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">Vol</TabsTrigger>
                  <TabsTrigger value="e1RM" className="text-[9px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">1RM</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weight">{renderChart('weight', 'Max Weight', unitLabel)}</TabsContent>
                <TabsContent value="reps">{renderChart('reps', 'Max Reps', 'reps')}</TabsContent>
                <TabsContent value="volume">{renderChart('volume', 'Total Volume', unitLabel)}</TabsContent>
                <TabsContent value="e1RM">
                  <div className="relative">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-9 w-9 text-muted-foreground bg-muted/20 rounded-full">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-[10px] font-bold leading-relaxed bg-popover text-popover-foreground border-border/50">
                          <p>Estimated 1RM is calculated using the Epley formula: Weight × (1 + Reps/30). Only valid for sets with 1-10 reps.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                    {renderChart('e1RM', 'Estimated 1RM', unitLabel)}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-8 border-t border-dashed border-border/60 flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground uppercase tracking-widest">
                    {history.length > 0 
                      ? `Last logged: ${new Date(history[history.length - 1].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
                      : 'No workouts recorded yet'}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Training consistency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
