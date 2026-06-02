
"use client"

import { BottomNav } from '@/components/BottomNav';
import { WorkoutCalendarMonth } from '@/components/WorkoutCalendarMonth';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ActivityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-5 py-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/30 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Your Activity</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Training History</p>
        </div>
      </header>

      <main className="flex-1 p-5 pb-32">
        <WorkoutCalendarMonth />
      </main>

      <BottomNav />
    </div>
  );
}
