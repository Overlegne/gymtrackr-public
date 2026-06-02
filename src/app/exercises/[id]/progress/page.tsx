"use client"

import { use, useState, useEffect, useMemo } from 'react';
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

// Required for static export with dynamic segments
export function generateStaticParams() {
  return [];
}
export const dynamicParams = false;

export default function ExerciseProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [isMounted, setIsMounted] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [plateau, setPlateau] = useState<PlateauAnalysis | null>(null);

  const settings = useMemo(() => getSettings(), []);
  const unitLabel = settings.unitSystem === 'Metric' ? 'kg' : 'lb';

  useEffect(() => {
    async function load() {
      setIsMounted(true);
      const exercises = await getExercises();
      const foundExercise = exercises.find(e => e.id === id);
      if (foundExercise) {
        setExercise(foundExercise);
      }
      const exerciseHistory = await getExerciseHistory(id);
      setHistory(exerciseHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setPlateau(await detectPlateau(id));
    }
    load();
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
      <div className="flex flex-col min-h-screen bg-background p-10 items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading charts...</p>
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
          <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-muted-foreground text-xs uppercase font-black">No logs found for this range.</p>
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
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              domain={['auto', 'auto']}
              width={35}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorMetric)"
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
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Progress</p>
        </div>
      </header>

      <main className="p-5 space-y-6 pb-24">
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-3xl border-none shadow-sm bg-card">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Best {unitLabel}</span>
                <span className="text-2xl font-black">{stats.bestWeight}</span>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-none shadow-sm bg-card">
              <CardContent className="p-5 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground">Volume PR</span>
                <span className="text-2xl font-black">{Math.round(stats.maxVolume)}</span>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-11 rounded-2xl bg-muted/30">
            <TabsTrigger value="weight" className="text-[9px] font-black uppercase">Weight</TabsTrigger>
            <TabsTrigger value="reps" className="text-[9px] font-black uppercase">Reps</TabsTrigger>
            <TabsTrigger value="volume" className="text-[9px] font-black uppercase">Vol</TabsTrigger>
            <TabsTrigger value="e1RM" className="text-[9px] font-black uppercase">1RM</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight">{renderChart('weight', 'Max Weight', unitLabel)}</TabsContent>
          <TabsContent value="reps">{renderChart('reps', 'Max Reps', 'reps')}</TabsContent>
          <TabsContent value="volume">{renderChart('volume', 'Total Volume', unitLabel)}</TabsContent>
          <TabsContent value="e1RM">{renderChart('e1RM', 'Estimated 1RM', unitLabel)}</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
