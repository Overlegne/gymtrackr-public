
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { enUS } from "date-fns/locale"
import { Flame, Moon } from "lucide-react"

export function WorkoutCalendar() {
  const [logs, setLogs] = React.useState<WorkoutLog[]>([])
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  React.useEffect(() => {
    setLogs(getWorkoutLogs())
  }, [])

  const logsByDate = React.useMemo(() => {
    const map: Record<string, WorkoutLog[]> = {}
    logs.forEach(log => {
      const d = log.date
      if (!map[d]) map[d] = []
      map[d].push(log)
    })
    return map
  }, [logs])

  // Simple streak calculation
  const streak = React.useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA');
    const logDates = new Set(logs.map(l => l.date));
    let count = 0;
    let curr = new Date();
    
    while (logDates.has(curr.toLocaleDateString('en-CA'))) {
      count++;
      curr.setDate(curr.getDate() - 1);
    }
    return count;
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Top Stats - Inspired by Reference */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Flame className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</p>
            <p className="text-sm font-black">{streak} days</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Moon className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rest Days</p>
            <p className="text-sm font-black">Ready</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="font-black text-xl tracking-tight">Activity Log</h3>
          <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] font-bold border-none px-3 py-1">
            {logs.length} sessions
          </Badge>
        </div>
        
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={enUS}
            weekStartsOn={1}
            showOutsideDays={false}
            className="p-0 w-full"
            classNames={{
              months: "w-full",
              month: "w-full space-y-6",
              caption: "flex justify-center pt-1 relative items-center mb-6",
              caption_label: "text-base font-black tracking-tight",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-slate-50 border-none rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors",
              table: "w-full border-collapse",
              head_row: "flex w-full justify-between mb-4",
              head_cell: "text-slate-400 w-10 font-bold text-[11px] uppercase text-center flex-1",
              row: "flex w-full justify-between mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-12 w-10 flex items-center justify-center flex-1",
              day: "h-10 w-10 p-0 font-bold text-slate-700 transition-all rounded-full flex items-center justify-center hover:bg-slate-50",
              day_today: "bg-primary/5 text-primary border-2 border-primary/20",
              day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white shadow-lg shadow-primary/30",
            }}
            components={{
              DayContent: ({ date: dayDate }) => {
                const d = dayDate.getDate();
                const dateStr = dayDate.toLocaleDateString('en-CA');
                const dayLogs = logsByDate[dateStr] || [];
                
                return (
                  <div className="flex flex-col items-center justify-center relative w-full h-full pt-1">
                    <span className="z-10">{d}</span>
                    {dayLogs.length > 0 && (
                      <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                        {dayLogs.slice(0, 3).map((log) => (
                          <div 
                            key={log.id} 
                            className="h-1.5 w-1.5 rounded-full shadow-sm ring-1 ring-white" 
                            style={{ backgroundColor: log.routineColor }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            }}
          />
        </div>
      </div>

      {/* Legend / Tip */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Today's Focus</h4>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Consistency is the secret ingredient to success. Each dot on your calendar represents a promise kept to yourself.
        </p>
      </div>
    </div>
  )
}
