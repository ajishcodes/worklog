import { useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { EntryListItem } from "@/components/entries/entry-list-item"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDateLong, formatMonthYear, toISODate } from "@/lib/format"
import { getEntriesForDate } from "@/lib/entries"
import { useEntries } from "@/hooks/use-entries"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CalendarPage() {
  const { entries } = useEntries()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selectedISO, setSelectedISO] = useState(() => toISODate(new Date()))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const entriesByDay = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of entries) {
      map.set(entry.date, (map.get(entry.date) ?? 0) + 1)
    }
    return map
  }, [entries])

  const selectedEntries = getEntriesForDate(entries, selectedISO)

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Browse entries month by month."
        action={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="w-32 text-center text-sm font-medium text-foreground">
              {formatMonthYear(month)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <div className="mb-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border bg-border">
        {days.map((day) => {
          const iso = toISODate(day)
          const count = entriesByDay.get(iso) ?? 0
          const inMonth = isSameMonth(day, month)
          const selected = iso === selectedISO

          return (
            <button
              key={iso}
              onClick={() => setSelectedISO(iso)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 bg-background text-sm transition-colors hover:bg-accent/60",
                !inMonth && "text-muted-foreground/40",
                selected && "bg-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {day.getDate()}
              </span>
              {count > 0 && (
                <span className="size-1 rounded-full bg-foreground/50" />
              )}
            </button>
          )
        })}
      </div>

      <section className="mt-10">
        <h2 className="mb-2 text-sm font-medium text-foreground">
          Entries for {formatDateLong(selectedISO)}
        </h2>
        {selectedEntries.length === 0 ? (
          <p className="border-b py-3 text-sm text-muted-foreground">
            No entries logged on this day.
          </p>
        ) : (
          <div>
            {selectedEntries.map((entry) => (
              <EntryListItem key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
