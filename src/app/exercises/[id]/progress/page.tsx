
"use client"

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getExercises, getExerciseHistory, type HistoryPoint } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, TrendingUp, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
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

type TimeRange = '30d' | '90d' | '1y' | 'all';

export default function ExerciseProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  
  const exercise = useMemo(() => {
    return getExercises().find(e => e.id === id);
  }, [id]);

  const history = useMemo(() => {
    return getExerciseHistory(id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [id]);

  const filteredHistory = useMemo(() => {
    if (timeRange === 'all') return history;
    
    const now = new Date();
    const rangeMs = {
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    }[timeRange];
    
    return history.filter(p => (now.getTime() - new Date(p.date).getTime()) <= rangeMs);
  }, [history, timeRange]);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    
    const weights = history.map(p => p.weight);
    const reps = history.map(p => p.reps);
    const volumes = history.map(p => p.volume);
    const e1rms = history.map(p => p.e1RM).filter(v => v > 0);

    const firstPoint = history[0];
    const lastPoint = history[history.length - 1];
    const weightDiff = lastPoint.weight - firstPoint.weight;

    return {
      bestWeight: Math.max(...weights),
      bestReps: Math.max(...reps),
      maxVolume: Math.max(...volumes),
      bestE1RM: e1rms.length > 0 ? Math.max(...e1rms) : 0,
      weightTrend: weightDiff
    };
  }, [history]);

  if (!exercise) return null;

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
          <p className="text-muted-foreground font-medium max-w-[200px]">
            Log this exercise a few times to see your progress.
          </p>
        </div>
      );
    }

    return (
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg shadow-lg p-3 text-xs space-y-1">
                      <p className="font-bold text-muted-foreground">{new Date(data.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                      <p className="font-black text-primary text-sm">{payload[0].value} {unit}</p>
                      {data.sets && <p className="text-[10px] text-muted-foreground uppercase font-bold">{data.sets} Sets loggeed</p>}
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
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMetric)"
              dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-5 py-4 flex items-center gap-4">
        <Link href="/exercises">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold truncate">{exercise.name}</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Progress Analytics</p>
        </div>
      </header>

      <main className="p-5 space-y-6 pb-24">
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Best Weight</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{stats.bestWeight}</span>
                  <span className="text-xs font-bold text-muted-foreground">kg</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Best e1RM</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{Math.round(stats.bestE1RM)}</span>
                  <span className="text-xs font-bold text-muted-foreground">kg</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Max Volume</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{Math.round(stats.maxVolume)}</span>
                  <span className="text-xs font-bold text-muted-foreground">kg</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Best Reps</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{stats.bestReps}</span>
                  <span className="text-xs font-bold text-muted-foreground">reps</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            {(['30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  timeRange === range 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-muted-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-black">Performance Chart</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Metrics over time</CardDescription>
                </div>
                {stats && stats.weightTrend !== 0 && (
                  <Badge variant={stats.weightTrend > 0 ? 'default' : 'destructive'} className="rounded-full h-6 px-3">
                    {stats.weightTrend > 0 ? '+' : ''}{stats.weightTrend}kg Trend
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weight" className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-10 rounded-xl bg-slate-100/50">
                  <TabsTrigger value="weight" className="text-[10px] font-black uppercase rounded-lg">Weight</TabsTrigger>
                  <TabsTrigger value="reps" className="text-[10px] font-black uppercase rounded-lg">Reps</TabsTrigger>
                  <TabsTrigger value="volume" className="text-[10px] font-black uppercase rounded-lg">Volume</TabsTrigger>
                  <TabsTrigger value="e1RM" className="text-[10px] font-black uppercase rounded-lg">1RM</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weight">{renderChart('weight', 'Max Weight', 'kg')}</TabsContent>
                <TabsContent value="reps">{renderChart('reps', 'Max Reps', 'reps')}</TabsContent>
                <TabsContent value="volume">{renderChart('volume', 'Total Volume', 'kg')}</TabsContent>
                <TabsContent value="e1RM">
                  <div className="relative">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8 text-muted-foreground">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-[10px] leading-relaxed">
                          <p>Estimated 1RM is calculated using the Epley formula: Weight × (1 + Reps/30). Only valid for sets with 1-10 reps.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                    {renderChart('e1RM', 'Estimated 1RM', 'kg')}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t border-dashed flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">
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
