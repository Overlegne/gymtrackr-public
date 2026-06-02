
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { enUS } from "date-fns/locale"

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

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-lg text-primary">Training Log</h3>
        <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] border-none px-2 py-0.5">
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
            month: "w-full space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-sm font-bold text-muted-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            table: "w-full border-collapse",
            head_row: "flex w-full justify-between mb-2",
            head_cell: "text-muted-foreground w-10 font-bold text-[10px] uppercase text-center flex-1",
            row: "flex w-full justify-between mt-1",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-10 w-10 flex items-center justify-center flex-1",
            day: "h-9 w-9 p-0 font-medium transition-all rounded-full flex items-center justify-center hover:bg-muted",
            day_today: "bg-accent/10 text-accent-foreground border-2 border-accent/20",
            day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
          }}
          components={{
            DayContent: ({ date: dayDate }) => {
              const d = dayDate.getDate();
              const dateStr = dayDate.toLocaleDateString('en-CA');
              const dayLogs = logsByDate[dateStr] || [];
              
              return (
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  <span className="z-10">{d}</span>
                  {dayLogs.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
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
