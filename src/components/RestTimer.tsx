
"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Pause, Play, SkipForward, Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestTimerProps {
  duration: number;
  trigger: number; // Used to reset/restart the timer
  onClose: () => void;
}

export function RestTimer({ duration, trigger, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeLeft(duration);
    setIsActive(true);
    setIsVisible(true);
  }, [trigger, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Haptic feedback could be triggered here
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTime = (secs: number) => setTimeLeft((prev) => Math.max(0, prev + secs));

  if (!isVisible) return null;

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] animate-in slide-in-from-bottom-5 duration-300">
      <Card className={cn(
        "border-none shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-300 ring-4 ring-primary/20",
        timeLeft === 0 ? "bg-primary animate-pulse" : "bg-card"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                timeLeft === 0 ? "bg-white text-primary" : "bg-primary/10 text-primary"
              )}>
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  timeLeft === 0 ? "text-white/80" : "text-muted-foreground"
                )}>
                  Rest Timer
                </p>
                <h4 className={cn(
                  "text-sm font-black uppercase tracking-tight",
                  timeLeft === 0 ? "text-white" : "text-foreground"
                )}>
                  {timeLeft === 0 ? "Ready to Lift!" : "Time to Recover"}
                </h4>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-full h-8 w-8", timeLeft === 0 ? "text-white hover:bg-white/20" : "")} 
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="relative flex-1 flex flex-col items-center">
              <span className={cn(
                "text-5xl font-black tabular-nums tracking-tighter",
                timeLeft === 0 ? "text-white" : "text-primary"
              )}>
                {formatTime(timeLeft)}
              </span>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10 border-primary/20 bg-muted/20"
                  onClick={() => addTime(-15)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10 border-primary/20 bg-muted/20"
                  onClick={() => addTime(15)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={isActive ? "secondary" : "default"}
                  size="icon" 
                  className="rounded-full h-10 w-10"
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 bg-muted/30"
                  onClick={() => setTimeLeft(0)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
