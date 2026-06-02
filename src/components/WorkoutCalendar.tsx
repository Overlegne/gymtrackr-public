
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { nl } from "date-fns/locale"

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
      // Use local date string to avoid timezone shifts
      const d = log.date // Expected format YYYY-MM-DD
      if (!map[d]) map[d] = []
      map[d].push(log)
    })
    return map
  }, [logs])

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border space-y-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-base text-primary">Activiteit</h3>
        <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] border-none">
          {logs.length} sessies
        </Badge>
      </div>
      
      <div className="flex justify-center border-t pt-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={nl}
          weekStartsOn={1}
          showOutsideDays={false}
          className="p-0 w-full"
          classNames={{
            months: "w-full",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center mb-2",
            caption_label: "text-sm font-bold text-muted-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            table: "w-full border-collapse space-y-1",
            head_row: "grid grid-cols-7 w-full",
            head_cell: "text-muted-foreground rounded-md font-bold text-[10px] uppercase text-center",
            row: "grid grid-cols-7 w-full mt-1",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-10 w-full flex items-center justify-center",
            day: "h-8 w-8 p-0 font-medium transition-all rounded-full flex items-center justify-center hover:bg-muted",
            day_today: "bg-accent/20 text-accent-foreground border-2 border-accent/30",
            day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
          }}
          components={{
            DayContent: ({ date: dayDate }) => {
              const d = dayDate.getDate();
              const dateStr = dayDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
              const dayLogs = logsByDate[dateStr] || [];
              
              return (
                <div className="flex flex-col items-center justify-center relative w-full h-full pt-1">
                  <span className="z-10">{d}</span>
                  {dayLogs.length > 0 && (
                    <div className="absolute bottom-0 flex gap-0.5 justify-center w-full pb-1">
                      {dayLogs.slice(0, 3).map((log) => (
                        <div 
                          key={log.id} 
                          className="h-1.5 w-1.5 rounded-full shadow-sm" 
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
  )
}
