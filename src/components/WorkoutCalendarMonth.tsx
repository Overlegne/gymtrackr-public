
"use client"

import * as React from "react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday
} from "date-fns"
import { enUS } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/store"
import { cn } from "@/lib/utils"

export function WorkoutCalendarMonth() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [logs, setLogs] = React.useState<WorkoutLog[]>([])

  React.useEffect(() => {
    setLogs(getWorkoutLogs())
  }, [])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Matrix Calculation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Ensure we always show 42 cells (6 rows) for a consistent layout
  const rows: Date[][] = []
  let days: Date[] = []
  
  calendarDays.forEach((day, i) => {
    if (i % 7 === 0 && i !== 0) {
      rows.push(days)
      days = []
    }
    days.push(day)
  })
  if (days.length > 0) rows.push(days)
  
  // Pad to 6 rows if necessary
  while (rows.length < 6) {
    const lastRow = rows[rows.length - 1]
    const lastDay = lastRow[6]
    const nextRowDays = eachDayOfInterval({
      start: addMonths(lastDay, 0), // dummy
      end: addMonths(lastDay, 0) // dummy
    }) // This is simplified; better to just add 7 days manually
    const newRow = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lastDay)
      d.setDate(d.getDate() + i + 1)
      return d
    })
    rows.push(newRow)
  }

  const logsForMonth = logs.filter(log => isSameMonth(new Date(log.date), currentMonth))
  
  // Streak calculation
  const streak = React.useMemo(() => {
    const logDates = new Set(logs.map(l => l.date))
    let count = 0
    let curr = new Date()
    while (logDates.has(curr.toLocaleDateString('en-CA'))) {
      count++
      curr.setDate(curr.getDate() - 1)
    }
    return count
  }, [logs])

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-black leading-tight">{streak} Days</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Streak</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-black leading-tight">{logs.length}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Sessions</p>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <header className="p-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight">Activity Log</h2>
            <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] font-black border-none px-3 py-1">
              {logsForMonth.length} this month
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-black">{format(currentMonth, 'MMMM yyyy')}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>
        </header>

        {/* Grid Body */}
        <div className="px-2 pb-6">
          <div className="grid grid-cols-7 border-t border-l border-slate-50">
            {rows.flat().map((day, i) => {
              const dateStr = day.toLocaleDateString('en-CA')
              const dayLogs = logs.filter(l => l.date === dateStr)
              const isCurrMonth = isSameMonth(day, currentMonth)
              const isTodaysDate = isToday(day)

              return (
                <div 
                  key={i} 
                  className={cn(
                    "min-h-[75px] border-r border-b border-slate-50 p-1 flex flex-col gap-1 transition-colors",
                    !isCurrMonth && "bg-slate-50/30 opacity-30",
                    isTodaysDate && "bg-primary/5"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                      isTodaysDate ? "bg-primary text-white" : "text-slate-600"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Workout Indicators */}
                  <div className="flex flex-col gap-1 mt-auto">
                    {dayLogs.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-0.5">
                          {dayLogs.slice(0, 2).map((log, idx) => (
                            <div 
                              key={idx} 
                              className="h-1.5 w-1.5 rounded-full" 
                              style={{ backgroundColor: log.routineColor }}
                            />
                          ))}
                          {dayLogs.length > 2 && (
                            <span className="text-[7px] font-black text-slate-400">+{dayLogs.length - 2}</span>
                          )}
                        </div>
                        <div className="text-[7px] font-bold text-slate-500 leading-tight truncate uppercase tracking-tighter">
                          {dayLogs[0].routineName}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Trainer Tip</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Consistency is better than intensity. A short workout is always better than no workout. Keep those dots coming!
        </p>
      </div>
    </div>
  )
}
