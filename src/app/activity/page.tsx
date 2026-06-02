
"use client"

import { BottomNav } from '@/components/BottomNav';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';

export default function ActivityPage() {
  return (
    <div className="p-5 space-y-6">
      <header className="py-4">
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-muted-foreground text-sm">Track your workout history and consistency.</p>
      </header>

      <WorkoutCalendar />

      <div className="bg-muted/30 p-5 rounded-2xl border">
        <h3 className="font-bold text-sm mb-2">Did you know?</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Consistent training is key to long-term progress. Use this calendar to keep an eye on your weekly volume and rest days.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
