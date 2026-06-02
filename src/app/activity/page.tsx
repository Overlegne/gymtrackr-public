
"use client"

import { BottomNav } from '@/components/BottomNav';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ActivityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-5 py-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Your Activity</h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Training History</p>
        </div>
      </header>

      <main className="flex-1 p-5 pb-32">
        <WorkoutCalendar />
      </main>

      <BottomNav />
    </div>
  );
}
