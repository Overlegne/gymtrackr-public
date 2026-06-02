
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function WorkoutCalendar() {
  const [logs, setLogs] = React.useState<WorkoutLog[]>([])
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  React.useEffect(() => {
    setLogs(getWorkoutLogs())
  }, [])

  // Map logs to dates for easier lookups
  const logsByDate = React.useMemo(() => {
    const map: Record<string, WorkoutLog[]> = {}
    logs.forEach(log => {
      if (!map[log.date]) map[log.date] = []
      map[log.date].push(log)
    })
    return map
  }, [logs])

  const workoutDays = logs.map(log => new Date(log.date))

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-lg">Mijn Voortgang</h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
          {logs.length} workouts
        </Badge>
      </div>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-none"
          components={{
            Day: ({ day, ...props }) => {
              const dateStr = day.date.toISOString().split('T')[0]
              const dayLogs = logsByDate[dateStr] || []
              
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <button
                    {...props}
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors hover:bg-accent ${
                      day.isSelected ? 'bg-primary text-primary-foreground' : ''
                    } ${day.isToday ? 'border border-primary/30' : ''}`}
                  >
                    {day.date.getDate()}
                  </button>
                  {dayLogs.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                      {dayLogs.slice(0, 3).map((log, i) => (
                        <div 
                          key={log.id} 
                          className="h-1.5 w-1.5 rounded-full" 
                          style={{ backgroundColor: log.routineColor }}
                          title={log.routineName}
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
  )
}
